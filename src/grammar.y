%start Program
%ebnf

%%

Identifier
  : IDENTIFIER {
        $$ = ($1 === 'this')
            ? yy.Node('ThisExpression', yy.loc(@1))
            : yy.Node('Identifier', parseIdentifierName($1), yy.loc(@1));
    }
  ;

IdentifierList
  : { $$ = []; }
  | IdentifierList Identifier {
        yy.locComb(@$, @Identifier);
        $$ = $IdentifierList;
        $IdentifierList.push($Identifier);
    }
  ;

Keyword
  : COLON IDENTIFIER { $$ = yy.Node('CallExpression', yy.Node('Identifier', 'keyword', yy.loc(@$)), [yy.Node('Literal', $2, yy.loc(@$))], yy.loc(@$)); }
  ;

AnonArg
  : ANON_ARG {
        var name = $1.slice(1);
        if (name === '') name = '1';
        if (name === '&') name = 'rest';
        var anonArgNum = (name === 'rest') ? 0 : Number(name);
        name = '__$' + name;
        $$ = yy.Node('Identifier', name, yy.loc(@1));
        $$.anonArg = true;
        $$.anonArgNum = anonArgNum;
    }
  ;

Atom
  : INTEGER { $$ = parseNumLiteral('Integer', $1, yy.loc(@1), yy, yytext); }
  | FLOAT { $$ = parseNumLiteral('Float', $1, yy.loc(@1), yy, yytext); }
  | STRING { $$ = parseLiteral('String', parseString($1), yy.loc(@1), yy.raw[yy.raw.length-1], yy); }
  | 'true' { $$ = parseLiteral('Boolean', true, yy.loc(@1), yytext, yy); }
  | 'false' { $$ = parseLiteral('Boolean', false, yy.loc(@1), yytext, yy); }
  | 'nil' { $$ = parseLiteral('Nil', null, yy.loc(@1), yytext, yy); }
  | Keyword
  | Identifier
  | AnonArg
  ;

CollectionLiteral
  : '[' SExprs?[items] ']' { $$ = parseCollectionLiteral('vector', getValueIfUndefined($items, []), yy.loc(@$), yy); }
  | QUOTE '(' SExprs?[items] ')' { $$ = parseCollectionLiteral('list', getValueIfUndefined($items, []), yy.loc(@$), yy); }
  | '{' SExprPairs[items] '}' { $$ = parseCollectionLiteral('hash-map', getValueIfUndefined($items, []), yy.loc(@$), yy); }
  | SHARP '{' SExprs?[items] '}' { $$ = parseCollectionLiteral('hash-set', getValueIfUndefined($items, []), yy.loc(@$), yy); }
  ;

Fn
  : Identifier
  | CollectionLiteral
  | Keyword
  | '(' List ')' { $$ = $List; }
  | AnonFnLiteral
  | AnonArg
  ;

IdOrDestrucForm
  : Identifier
  | DestructuringForm
  ;

IdOrDestrucList
  : { $$ = []; }
  | IdOrDestrucList IdOrDestrucForm {
        yy.locComb(@$, @IdOrDestrucForm);
        $$ = $IdOrDestrucList;
        $IdOrDestrucList.push($IdOrDestrucForm);
    }
  ;

FnArgs
  : IdOrDestrucList { $$ = { fixed: $IdOrDestrucList, rest: null }; }
  | IdOrDestrucList '&' IdOrDestrucForm {
        if ($IdOrDestrucForm.keys && $IdOrDestrucForm.ids) {
            throw new Error('Rest args cannot be destructured by a hash map');
        }
        $$ = { fixed: $IdOrDestrucList, rest: $IdOrDestrucForm };
    }
  ;

AsForm
  : AS Identifier { $$ = $Identifier; }
  ;

MapDestrucArgs
  : { $$ = { keys: [], ids: [] }; }
  | MapDestrucArgs AsForm {
        $MapDestrucArgs.destrucId = $AsForm;
        $$ = $MapDestrucArgs;
    }
  | MapDestrucArgs KEYS '[' IdentifierList ']' {
        var id;
        for (var i = 0, len = $IdentifierList.length; i < len; ++i) {
            id = $IdentifierList[i];
            $MapDestrucArgs.ids.push(id);
            $MapDestrucArgs.keys.push(yy.Node('CallExpression',
                yy.Node('Identifier', 'keyword', id.loc),
                [yy.Node('Literal', id.name, id.loc)], id.loc));
        }
        $$ = $MapDestrucArgs;
    }
  | MapDestrucArgs STRS '[' IdentifierList ']' {
        var id;
        for (var i = 0, len = $IdentifierList.length; i < len; ++i) {
            id = $IdentifierList[i];
            $MapDestrucArgs.ids.push(id);
            $MapDestrucArgs.keys.push(yy.Node('Literal', id.name, id.loc));
        }
        $$ = $MapDestrucArgs;
    }
  | MapDestrucArgs IdOrDestrucForm SExpr {
        $MapDestrucArgs.ids.push($IdOrDestrucForm);
        $MapDestrucArgs.keys.push($SExpr);
        $$ = $MapDestrucArgs;
    }
  ;

DestructuringForm
  : '[' FnArgs AsForm?[asForm] ']' {
        $$ = $FnArgs;
        $$.destrucId = getValueIfUndefined($asForm, yy.Node('Identifier', null, yy.loc(@1)));
    }
  | '{' MapDestrucArgs '}' {
        $$ = $MapDestrucArgs;
        $$.destrucId = getValueIfUndefined($$.destrucId, yy.Node('Identifier', null, yy.loc(@1)));
    }
  ;

FnArgsAndBody
  : '[' FnArgs ']' BlockStatementWithReturn {
        var processed = processSeqDestrucForm($FnArgs, yy);
        var ids = processed.ids;
        $BlockStatementWithReturn.body = processed.stmts.concat($BlockStatementWithReturn.body);

        var hasRecurForm = processRecurFormIfAny($BlockStatementWithReturn, ids, yy);
        if (hasRecurForm) {
            var blockLoc = $BlockStatementWithReturn.loc;
            $BlockStatementWithReturn = yy.Node('BlockStatement', [
                yy.Node('WhileStatement', yy.Node('Literal', true, blockLoc),
                    $BlockStatementWithReturn, blockLoc)], blockLoc);
        }

        var arityCheck = createArityCheckStmt(ids.length, $FnArgs.rest, yy.loc(@FnArgs), yy);
        $BlockStatementWithReturn.body.unshift(arityCheck);

        $$ = yy.Node('FunctionExpression', null, ids, null,
            $BlockStatementWithReturn, false, false, yy.loc(@BlockStatementWithReturn));
    }
  ;

FnDefinition
  : FN FnArgsAndBody { $$ = $FnArgsAndBody; }
  | DEFN Identifier FnArgsAndBody { $$ = parseVarDecl($Identifier, $FnArgsAndBody, yy.loc(@1), yy); }
  ;

AnonFnLiteral
  : SHARP '(' List ')' {
        var body = $3, bodyLoc = @3;
        var maxArgNum = 0;
        var hasRestArg = false;
        estraverse.traverse(body, {
            enter: function (node) {
                if (node.type === 'Identifier' && node.anonArg) {
                    if (node.anonArgNum === 0)   // 0 denotes rest arg
                        hasRestArg = true;
                    else if (node.anonArgNum > maxArgNum)
                        maxArgNum = node.anonArgNum;
                    delete node.anonArg;
                    delete node.anonArgNum;
                }
            }
        });
        var args = [];
        for (var i = 1; i <= maxArgNum; ++i) {
            args.push(yy.Node('Identifier', '__$' + i, yy.loc(@3)));
        }
        body = wrapInExpressionStatement(body, yy);
        body = yy.Node('BlockStatement', [body], yy.loc(bodyLoc));
        createReturnStatementIfPossible(body, yy);
        if (hasRestArg) {
            var restId = yy.Node('Identifier', '__$rest', yy.loc(bodyLoc));
            var restDecl = createRestArgsDecl(restId, null, maxArgNum, yy.loc(bodyLoc), yy);
            body.body.unshift(restDecl);
        }

        var arityCheck = createArityCheckStmt(maxArgNum, hasRestArg, yy.loc(@1), yy);
        body.body.unshift(arityCheck);

        $$ = yy.Node('FunctionExpression', null, args, null, body,
            false, false, yy.loc(@1));
    }
  ;

ConditionalExpr
  : IF SExpr[test] SExprStmt[consequent] SExprStmt?[alternate] {
        $$ = yy.Node('IfStatement', $test, $consequent, getValueIfUndefined($alternate, null), yy.loc(@1));
        // for code like ((if true +) 1 2 3)
        if ($$.consequent.type === 'ExpressionStatement' &&
            ($$.alternate === null || $$.alternate.type === 'ExpressionStatement')) {
            $$.type = 'ConditionalExpression';
            $$.consequent = $$.consequent.expression;
            if ($$.alternate === null)
                $$.alternate = yy.Node('Literal', null, yy.loc(@1));
            else
                $$.alternate = $$.alternate.expression;
        }
    }
  | IF_NOT SExpr[test] SExprStmt[consequent] SExprStmt?[alternate] {
        $$ = yy.Node('IfStatement', $test, $consequent, getValueIfUndefined($alternate, null), yy.loc(@1));
        // for code like ((if-not true +) 1 2 3)
        if ($$.consequent.type === 'ExpressionStatement' &&
            ($$.alternate === null || $$.alternate.type === 'ExpressionStatement')) {
            $$.type = 'ConditionalExpression';
            var testLoc = yy.loc(@test);
            $$.test = yy.Node('CallExpression', yy.Node('Identifier', 'not', testLoc),
                [$$.test], testLoc);
            $$.consequent = $$.consequent.expression;
            if ($$.alternate === null)
                $$.alternate = yy.Node('Literal', null, yy.loc(@1));
            else
                $$.alternate = $$.alternate.expression;
        }
    }
  | WHEN SExpr[test] BlockStatement[consequent] {
        $$ = yy.Node('IfStatement', $test, $consequent, null, yy.loc(@1));
    }
  | WHEN_NOT SExpr[test] BlockStatement[consequent] {
        $$ = yy.Node('IfStatement', $test, $consequent, null, yy.loc(@1));
        var testLoc = yy.loc(@test);
        $$.test = yy.Node('CallExpression', yy.Node('Identifier', 'not', testLoc),
            [$$.test], testLoc);
    }
  ;

LogicalExpr
  : AND SExprs?[exprs] {
        $exprs = getValueIfUndefined($exprs, [yy.Node('Literal', true, yy.loc(@1))]);
        $$ = parseLogicalExpr('&&', $exprs, yy.loc(@1), yy);
    }
  | OR SExprs?[exprs] {
        $exprs = getValueIfUndefined($exprs, [yy.Node('Literal', null, yy.loc(@1))]);
        $$ = parseLogicalExpr('||', $exprs, yy.loc(@1), yy);
    }
  ;

VarDeclaration
  : DEF Identifier SExpr?[init] { $$ = parseVarDecl($Identifier, $init, yy.loc(@$), yy); }
  ;

LetBinding
  : IdOrDestrucForm SExpr {
        var processed = processDestrucForm({ fixed: [$IdOrDestrucForm], rest: null }, yy);
        $$ = {
            decl: yy.Node('VariableDeclarator', processed.ids[0], getValueIfUndefined($SExpr, null), yy.loc(@IdOrDestrucForm)),
            stmts: processed.stmts
        };
    }
  ;

LetBindings
  : LetBindings LetBinding {
        var decl = yy.Node('VariableDeclaration', 'var', [$LetBinding.decl], yy.loc(@LetBinding));
        $LetBindings.push({ decl: decl, stmts: $LetBinding.stmts });
        $$ = $LetBindings;
    }
  | { $$ = []; }
  ;

LetForm
  : LET '[' LetBindings ']' DoForm {
        var body = [], i, len, letBinding;
        for (i = 0, len = $LetBindings.length; i < len; ++i) {
            letBinding = $LetBindings[i];
            body = body.concat([letBinding.decl]).concat(letBinding.stmts);
        }
        body = body.concat($DoForm);
        $$ = wrapInIIFE(body, yy.loc(@1), yy);
    }
  ;

SetForm
  : SETVAL Identifier SExpr { $$ = yy.Node('AssignmentExpression', '=', $Identifier, $SExpr, yy.loc(@1)); }
  | SETVAL '(' DOT IDENTIFIER[prop] SExpr[obj] ')' SExpr[val] {
        var lhs = yy.Node('MemberExpression', $obj,
            yy.Node('Identifier', $prop, yy.loc(@prop)),
            false, yy.loc(@DOT));
        $$ = yy.Node('AssignmentExpression', '=', lhs, $val, yy.loc(@1));
    }
  ;

LoopForm
  : LOOP '[' LetBindings ']' BlockStatement {
        var body = [], i, len, letBinding;

        // unwrap IIFEs in loop body, sacrificing strict scoping rules for correct behaviour
        // I wish there was a cleaner solution
        // see https://github.com/vickychijwani/closer.js/issues/2
        estraverse.replace($BlockStatement, {
            leave: function (node) {
                var exp = node.argument || node.expression;  // ReturnStatement or ExpressionStatement
                if (exp && exp.iife === true) {
                    return unwrapIIFE(exp);
                }
                return node;
            }
        });

        for (i = 0, len = $LetBindings.length; i < len; ++i) {
            letBinding = $LetBindings[i];
            body.push(letBinding.decl);
            $BlockStatement.body = letBinding.stmts.concat($BlockStatement.body);
        }

        body.push($BlockStatement);
        $$ = wrapInIIFE(body, yy.loc(@1), yy);

        var blockBody = $$.callee.object.body.body, whileBlock, whileBlockIdx, stmt;
        for (var i = 0, len = blockBody.length; i < len; ++i) {
            stmt = blockBody[i];
            if (stmt.type === 'BlockStatement') {
                whileBlockIdx = i;
                whileBlock = stmt;
            }
        }

        var actualArgs = [];
        for (var i = 0, len = $LetBindings.length; i < len; ++i) {
            actualArgs.push($LetBindings[i].decl.declarations[0].id);
        }

        processRecurFormIfAny(whileBlock, actualArgs, yy);

        var whileBody = whileBlock.body;
        var lastLoc = (whileBody.length > 0) ? (whileBody[whileBody.length-1].loc) : whileBlock.loc;
        whileBody.push(yy.Node('BreakStatement', null, lastLoc));
        blockBody[whileBlockIdx] = yy.Node('WhileStatement', yy.Node('Literal', true, yy.loc(@BlockStatement)),
            whileBlock, yy.loc(@BlockStatement));
    }
  ;

RecurForm
  : RECUR SExprs?[args] {
        $args = getValueIfUndefined($args, []);
        var body = [], id, assignment, arg;
        for (var i = 0; i < $args.length; ++i) {
            arg = $args[i];
            id = yy.Node('Identifier', '__$recur' + i, arg.loc);
            id.recurArg = true;
            id.recurArgIdx = i;
            assignment = yy.Node('AssignmentExpression', '=', id, arg, arg.loc);
            body.push(wrapInExpressionStatement(assignment, yy));
        }
        $$ = yy.Node('BlockStatement', body, yy.loc(@1));
        $$.recurBlock = true;
    }
  ;

DoTimesForm
  : DOTIMES '[' Identifier SExpr ']' BlockStatement {
        var init = parseVarDecl($Identifier,
            parseNumLiteral('Integer', '0', yy.loc(@Identifier), yy),
            yy.loc(@Identifier), yy);
        var maxId = yy.Node('Identifier', '__$max' + dotimesIdx++, yy.loc(@SExpr));
        addVarDecl(init, maxId, $SExpr, yy.loc(@SExpr), yy);
        var test = yy.Node('BinaryExpression', '<', $Identifier, maxId, yy.loc(@Identifier));
        var update = yy.Node('UpdateExpression', '++', $Identifier, true, yy.loc(@Identifier));
        var forLoop = yy.Node('ForStatement', init, test, update, $BlockStatement, yy.loc(@1));
        // wrapping it in an IIFE makes it not work in CodeCombat
        // see https://github.com/codecombat/aether/issues/49
        // $$ = wrapInIIFE([forLoop], yy.loc(@1), yy);
        $$ = forLoop;
    }
  ;

DoSeqForm
  : DOSEQ '[' Identifier SExpr ']' BlockStatement {
        var idLoc = yy.loc(@Identifier), sexprLoc = yy.loc(@SExpr);
        var seqId = yy.Node('Identifier', '__$doseqSeq' + doseqIdx++, sexprLoc);
        var init = parseVarDecl(seqId, $SExpr, sexprLoc, yy);
        addVarDecl(init, $Identifier,
            yy.Node('CallExpression', yy.Node('Identifier', 'first', idLoc),
                [seqId], idLoc), idLoc, yy);
        var test = yy.Node('BinaryExpression', '!==', $Identifier,
            yy.Node('Literal', null, idLoc), idLoc);
        var seqUpdate = yy.Node('AssignmentExpression', '=', seqId,
            yy.Node('CallExpression', yy.Node('Identifier', 'rest', sexprLoc),
                [seqId], sexprLoc), sexprLoc);
        var idUpdate = yy.Node('AssignmentExpression', '=', $Identifier,
            yy.Node('CallExpression', yy.Node('Identifier', 'first', idLoc),
                [seqId], idLoc), idLoc);
        var update = yy.Node('SequenceExpression', [seqUpdate, idUpdate], idLoc);
        var forLoop = yy.Node('ForStatement', init, test, update, $BlockStatement, yy.loc(@1));
        // wrapping it in an IIFE makes it not work in CodeCombat
        // see https://github.com/codecombat/aether/issues/49
        // $$ = wrapInIIFE([forLoop], yy.loc(@1), yy);
        $$ = forLoop;
    }
  ;

WhileForm
  : WHILE SExpr BlockStatement {
        var whileLoop = yy.Node('WhileStatement', $SExpr, $BlockStatement, yy.loc(@1));
        // wrapping it in an IIFE makes it not work in CodeCombat
        // see https://github.com/codecombat/aether/issues/49
        // $$ = wrapInIIFE([whileLoop], yy.loc(@1), yy);
        $$ = whileLoop;
    }
  ;

DotForm
  : DOT IDENTIFIER[prop] SExpr[obj] SExprs?[args] {
        $args = getValueIfUndefined($args, []);
        var callee = yy.Node('MemberExpression', $obj,
            yy.Node('Literal', $prop, yy.loc(@prop)),
            true, yy.loc(@$));
        var fnCall = yy.Node('CallExpression', callee, $args, yy.loc(@$));
        if ($args.length > 0) {
            $$ = fnCall;
        } else {
            // (.prop obj) can either be a call to a 0-argument fn, or a property access.
            // if both are possible, the function call is chosen. This is as per Clojure.
            // see http://clojure.org/java_interop#Java%20Interop-The%20Dot%20special%20form
            // (typeof obj['prop'] === 'function' && obj['prop'].length === 0) ? obj['prop']() : obj['prop'];
            $$ = yy.Node('ConditionalExpression',
                yy.Node('LogicalExpression', '&&',
                    yy.Node('BinaryExpression', '===',
                        yy.Node('UnaryExpression', 'typeof', callee, true, yy.loc(@$)),
                        yy.Node('Literal', 'function', yy.loc(@$)), yy.loc(@$)),
                    yy.Node('BinaryExpression', '===',
                        yy.Node('MemberExpression', callee,
                            yy.Node('Identifier', 'length', yy.loc(@$)),
                            false, yy.loc(@$)),
                        yy.Node('Literal', 0, yy.loc(@$)), yy.loc(@$)),
                    yy.loc(@$)),
                fnCall, callee, yy.loc(@$));
        }
    }
  ;

NewForm
  : NEW Identifier[konstructor] SExprs?[args] {
        $$ = yy.Node('NewExpression', $konstructor, getValueIfUndefined($args, []), yy.loc(@1));
    }
  | Identifier[konstructor] DOT SExprs?[args] {
        $$ = yy.Node('NewExpression', $konstructor, getValueIfUndefined($args, []), yy.loc(@1));
    }
  ;

List
  : { $$ = yy.Node('EmptyStatement', yy.loc(@1)); }
  | FnDefinition
  | ConditionalExpr
  | LogicalExpr
  | VarDeclaration
  | LetForm
  | SetForm
  | LoopForm
  | RecurForm
  | DoTimesForm
  | DoSeqForm
  | WhileForm
  | DotForm
  | NewForm
  | Fn SExprs?[args] {
        yy.locComb(@$, @2);
        var callee = yy.Node('MemberExpression', $Fn,
            yy.Node('Identifier', 'call', yy.loc(@1)),
            false, yy.loc(@Fn));
        $args = getValueIfUndefined($args, []);
        $args.unshift(yy.Node('ThisExpression', yy.loc(@1)));
        $$ = yy.Node('CallExpression', callee, $args, yy.loc(@$));
    }
  | DO DoForm { $$ = wrapInIIFE($DoForm, yy.loc(@1), yy); }
  ;

SExpr
  : Atom { $$ = $Atom; }
  | CollectionLiteral { $$ = $CollectionLiteral; }
  | '(' List ')' { $$ = $List; }
  | AnonFnLiteral
  ;

SExprStmt
  : SExpr { $$ = wrapInExpressionStatement($SExpr, yy); }
  ;

SExprPairs
  : { $$ = []; }
  | SExprPairs SExpr SExpr { $$ = $SExprPairs; $SExprPairs.push($2, $3); }
  ;

SExprs
  : SExpr { $$ = [$SExpr]; }
  | SExprs SExpr {
        yy.locComb(@$, @SExpr);
        $$ = $SExprs;
        $SExprs.push($SExpr);
    }
  ;

NonEmptyDoForm
    : SExprs {
        for (var i = 0, len = $SExprs.length; i < len; ++i) {
            $SExprs[i] = wrapInExpressionStatement($SExprs[i], yy);
        }
    }
  ;

DoForm
  : NonEmptyDoForm
  | {
        // do forms evaluate to nil if the body is empty
        nilNode = parseLiteral('Nil', null, yy.loc(@1), yytext, yy);
        $$ = [yy.Node('ExpressionStatement', nilNode, nilNode.loc)];
    }
  ;

BlockStatement
  : DoForm {
        $$ = yy.Node('BlockStatement', $DoForm, yy.loc(@DoForm));
    }
  ;

BlockStatementWithReturn
  : BlockStatement {
        $$ = createReturnStatementIfPossible($BlockStatement, yy);
    }
  ;

Program
  : NonEmptyDoForm 'END-OF-FILE' {
        var prog = yy.Node('Program', $NonEmptyDoForm, yy.loc(@NonEmptyDoForm));
        resetGeneratedIds();
        processLocsAndRanges(prog, yy.locs, yy.ranges);
        deleteExtraProperties(prog);
        return prog;
    }
  | 'END-OF-FILE' {
        var prog = yy.Node('Program', [], {
            end: { column: 0, line: 0 },
            start: { column: 0, line: 0 },
            range: [0, 0]
        });
        resetGeneratedIds();
        processLocsAndRanges(prog, yy.locs, yy.ranges);
        return prog;
    }
  ;

%%

var estraverse = require('estraverse');

var expressionTypes = ['ThisExpression', 'ArrayExpression', 'ObjectExpression',
    'FunctionExpression', 'ArrowExpression', 'SequenceExpression', 'Identifier',
    'UnaryExpression', 'BinaryExpression', 'AssignmentExpression', 'Literal',
    'UpdateExpression', 'LogicalExpression', 'ConditionalExpression',
    'NewExpression', 'CallExpression', 'MemberExpression'];

// indices for generated identifiers
var destrucArgIdx, doseqIdx, dotimesIdx;
resetGeneratedIds();
function resetGeneratedIds() {
    destrucArgIdx = doseqIdx = dotimesIdx = 0;
}

function processSeqDestrucForm(args, yy) {
    var i, len, arg;
    var fixed = args.fixed, rest = args.rest;
    var ids = [], stmts = [];
    for (i = 0, len = fixed.length; i < len; ++i) {
        arg = fixed[i];
        if (arg.type && arg.type === 'Identifier') {
            ids.push(arg);
        } else if (! arg.type) {
            arg.destrucId.name = arg.destrucId.name || '__$destruc' + destrucArgIdx++;
            ids.push(arg.destrucId);
            stmts = processChildDestrucForm(arg, stmts, yy);
        }
    }

    if (rest) {
        if (rest.type && rest.type === 'Identifier') {
            decl = createRestArgsDecl(rest, args.destrucId, fixed.length, rest.loc, yy);
            stmts.push(decl);
        } else if (! rest.type) {
            rest.destrucId.name = rest.destrucId.name || '__$destruc' + destrucArgIdx++;
            decl = createRestArgsDecl(rest.destrucId, args.destrucId, fixed.length, rest.destrucId.loc, yy);
            stmts.push(decl);
            stmts = processChildDestrucForm(rest, stmts, yy);
        }
    }

    return { ids: ids, pairs: [], stmts: stmts };
}

function processMapDestrucForm(args, yy) {
    var keys = args.keys, valIds = args.ids, key, id;
    var pairs = [], stmts = [];
    var decl, init, yyloc;
    for (var i = 0, len = valIds.length; i < len; ++i) {
        id = valIds[i], key = keys[i];
        if (id.type && id.type === 'Identifier') {
            yyloc = id.loc;
            init = yy.Node('CallExpression',
                yy.Node('Identifier', 'get', yyloc),
                [args.destrucId, key], yyloc);
            decl = parseVarDecl(id, init, yyloc, yy);
            stmts.push(decl);
        } else if (! id.type) {
            id.destrucId.name = id.destrucId.name || '__$destruc' + destrucArgIdx++;
            pairs.push({ id: id.destrucId, key: key });
            stmts = processChildDestrucForm(id, stmts, yy);
        }
    }
    return { ids: [], pairs: pairs, stmts: stmts };
}

function processDestrucForm(args, yy) {
    if (args.fixed !== undefined && args.rest !== undefined) {
        return processSeqDestrucForm(args, yy);
    } else if (args.keys !== undefined && args.ids !== undefined) {
        return processMapDestrucForm(args, yy);
    }
}

function processChildDestrucForm(arg, stmts, yy) {
    var i, len, processed = processDestrucForm(arg, yy);
    var processedId, processedKey, yyloc, init, decl, nilDecl, tryStmt, catchClause, errorId;
    for (i = 0, len = processed.ids.length; i < len; ++i) {
        processedId = processed.ids[i];
        yyloc = processedId.loc;
        init = yy.Node('CallExpression',
            yy.Node('Identifier', 'nth', yyloc),
            [arg.destrucId, yy.Node('Literal', i, yyloc)],
            yyloc);

        decl = parseVarDecl(processedId, init, processedId.loc, yy);
        nilDecl = parseVarDecl(processedId, yy.Node('Literal', null, yyloc), processedId.loc, yy);

        errorId = yy.Node('Identifier', '__$error', yyloc);
        catchClause = yy.Node('CatchClause', errorId, null,
            yy.Node('BlockStatement', [
                yy.Node('IfStatement',
                    yy.Node('BinaryExpression', '!==',
                        yy.Node('MemberExpression', errorId,
                            yy.Node('Identifier', 'name', yyloc), false, yyloc),
                        yy.Node('Literal', 'IndexOutOfBoundsError', yyloc),
                        yyloc),
                    yy.Node('ThrowStatement', errorId, yyloc),
                    null, yyloc),
                wrapInExpressionStatement(
                    yy.Node('AssignmentExpression', '=', processedId,
                        yy.Node('Literal', null, yyloc), yyloc),
                    yy)],
                yyloc),
            yyloc);

        tryStmt = yy.Node('TryStatement',
            yy.Node('BlockStatement', [decl], yyloc),
            [catchClause], null, yyloc);

        stmts.push(tryStmt);
    }
    for (i = 0, len = processed.pairs.length; i < len; ++i) {
        processedId = processed.pairs[i].id, processedKey = processed.pairs[i].key;
        yyloc = processedId.loc;
        init = yy.Node('CallExpression',
            yy.Node('Identifier', 'get', yyloc),
            [arg.destrucId, processedKey], yyloc);
        decl = parseVarDecl(processedId, init, yyloc, yy);
        stmts.push(decl);
    }
    return stmts.concat(processed.stmts);
}

function processRecurFormIfAny(rootNode, actualArgs, yy) {
    var hasRecurForm = false;
    estraverse.traverse(rootNode, {
        enter: function (node) {
            if (node.type === 'FunctionExpression' || node.type === 'FunctionDeclaration') {
                return estraverse.VisitorOption.Skip;
            } else if (node.type === 'BlockStatement' && node.recurBlock) {
                hasRecurForm = true;
                var body = node.body;

                // get rid of return statement
                var lastStmt = body.length > 0 ? body[body.length-1] : null;
                if (lastStmt && lastStmt.type === 'ReturnStatement') {
                    lastStmt.type = 'ExpressionStatement';
                    lastStmt.expression = lastStmt.argument;
                    delete lastStmt.argument;
                }

                estraverse.traverse(node, {
                    enter: function (innerNode) {
                        if (innerNode.type === 'Identifier' && innerNode.recurArg) {
                            var actualArg = actualArgs[innerNode.recurArgIdx];
                            body.push(wrapInExpressionStatement(yy.Node('AssignmentExpression', '=', actualArg, innerNode, innerNode.loc), yy));
                            delete innerNode.recurArg;
                            delete innerNode.recurArgIdx;
                        }
                    }
                });

                var lastLoc = (body.length > 0) ? (body[body.length-1].loc) : body.loc;
                body.push(yy.Node('ContinueStatement', null, lastLoc));
                delete node.recurBlock;
            }
        }
    });
    return hasRecurForm;
}

// wrap the given array of statements in an IIFE (Immediately-Invoked Function Expression)
function wrapInIIFE(body, yyloc, yy) {
    var iife = yy.Node('CallExpression',
        yy.Node('MemberExpression',
            yy.Node('FunctionExpression',
                null, [], null,
                createReturnStatementIfPossible(yy.Node('BlockStatement', body, yyloc), yy),
                false, false, yyloc),
            yy.Node('Identifier', 'call', yyloc), false, yyloc),
        [yy.Node('ThisExpression', yyloc)],
        yyloc);
    iife.iife = true;  // must delete this marker property before returning parser output
    return iife;
}

// unwrap IIFE and return a BlockStatement
function unwrapIIFE(node) {
    return (node.iife === true) ? node.callee.object.body : node;
}

function deleteExtraProperties(prog) {
    estraverse.traverse(prog, {
        enter: function (node) {
            if (node.iife !== undefined) {
                delete node.iife;
            }
        }
    });
}

function wrapInExpressionStatement(expr, yy) {
    if (expressionTypes.indexOf(expr.type) !== -1) {
        return yy.Node('ExpressionStatement', expr, expr.loc);
    }
    return expr;
}

function createArityCheckStmt(minArity, hasRestArgs, yyloc, yy) {
    var arityCheckArgs = [yy.Node('Literal', minArity, yyloc)];
    if (hasRestArgs) {
        arityCheckArgs.push(yy.Node('Identifier', 'Infinity', yyloc));
    }
    arityCheckArgs.push(yy.Node('MemberExpression',
        yy.Node('Identifier', 'arguments', yyloc),
        yy.Node('Identifier', 'length', yyloc), false, yyloc));
    var arityCheck = yy.Node('CallExpression',
        yy.Node('MemberExpression',
            yy.Node('Identifier', 'assertions', yyloc),
            yy.Node('Identifier', 'arity', yyloc),
            false, yyloc),
        arityCheckArgs, yyloc);
    return wrapInExpressionStatement(arityCheck, yy);
}

function createReturnStatementIfPossible(stmt, yy) {
    if (stmt === undefined || stmt === null || ! stmt.type)
        return stmt;
    var lastStmts = [], lastStmt;
    if (stmt.type === 'BlockStatement') {
        lastStmts.push(stmt.body[stmt.body.length - 1]);
    } else if (stmt.type === 'IfStatement') {
        lastStmts.push(stmt.consequent);
        if (stmt.alternate === null) {
            stmt.alternate = wrapInExpressionStatement(yy.Node('Literal', null, stmt.consequent.loc), yy);
        }
        lastStmts.push(stmt.alternate);
    } else {
        return stmt;
    }
    for (var i = 0; i < lastStmts.length; ++i) {
        lastStmt = lastStmts[i];
        if (! lastStmt) continue;
        if (lastStmt.type === 'ExpressionStatement') {
            lastStmt.type = 'ReturnStatement';
            lastStmt.argument = lastStmt.expression;
            delete lastStmt.expression;
        } else {
            createReturnStatementIfPossible(lastStmt, yy);
        }
    }
    return stmt;
}

function createRestArgsDecl(id, argsId, offset, yyloc, yy) {
    var restInit;
    if (! argsId) {
        restInit = yy.Node('CallExpression', yy.Node('Identifier', 'seq', yyloc),
            [yy.Node('CallExpression',
                yy.Node('MemberExpression',
                    yy.Node('MemberExpression',
                        yy.Node('MemberExpression',
                            yy.Node('Identifier', 'Array', yyloc),
                            yy.Node('Identifier', 'prototype', yyloc), false, yyloc),
                        yy.Node('Identifier', 'slice', yyloc), false, yyloc),
                    yy.Node('Identifier', 'call', yyloc), false, yyloc),
                [yy.Node('Identifier', 'arguments', yyloc),
                 yy.Node('Literal', offset, yyloc)])],
            yyloc);
    } else {
        restInit = yy.Node('CallExpression', yy.Node('Identifier', 'drop', yyloc),
            [yy.Node('Literal', offset, yyloc), argsId]);
    }
    return parseVarDecl(id, restInit, yyloc, yy);
}

function parseLogicalExpr(op, exprs, yyloc, yy) {
    var logicalExpr = exprs[0];
    for (var i = 1, len = exprs.length; i < len; ++i) {
        logicalExpr = yy.Node('LogicalExpression', op, logicalExpr, exprs[i], yyloc);
    }
    return logicalExpr;
}

function parseVarDecl(id, init, yyloc, yy) {
    var stmt = yy.Node('VariableDeclaration', 'var', [], yyloc);
    return addVarDecl(stmt, id, init, yyloc, yy);
}

function addVarDecl(stmt, id, init, yyloc, yy) {
    var decl = yy.Node('VariableDeclarator', id, getValueIfUndefined(init, null), yyloc);
    stmt.declarations.push(decl);
    return stmt;
}

function parseNumLiteral(type, token, yyloc, yy, yytext) {
    var node;
    if (token[0] === '-') {
        node = parseLiteral(type, -Number(token), yyloc, yytext, yy);
        node = yy.Node('UnaryExpression', '-', node, true, yyloc);
    } else {
        node = parseLiteral(type, Number(token), yyloc, yytext, yy);
    }
    return node;
}

function parseLiteral(type, value, yyloc, raw, yy) {
    return yy.Node('Literal', value, yyloc, raw);
}

function parseCollectionLiteral(type, items, yyloc, yy) {
    return yy.Node('CallExpression', yy.Node('Identifier', parseIdentifierName(type), yyloc), items, yyloc);
}

var charMap = {
    '-': '_$_',
    '+': '_$PLUS_',
    '>': '_$GT_',
    '<': '_$LT_',
    '=': '_$EQ_',
    '!': '_$BANG_',
    '*': '_$STAR_',
    '/': '_$SLASH_',
    '?': '_$QMARK_'
};

// list of reserved words (current and future) in ES6
var reservedWords = ['await', 'break', 'case', 'class', 'catch', 'const', 'continue',
    'debugger', 'default', 'delete', 'do', 'else', 'enum', 'export', 'extends',
    'finally', 'for', 'function', 'if', 'implements', 'import', 'in', 'instanceof',
    'interface', 'let', 'new', 'package', 'private', 'protected', 'public',
    'return', 'static', 'super', 'switch', 'this', 'throw', 'try', 'typeof', 'var',
    'void', 'while', 'with', 'yield'];

function parseIdentifierName(name) {
    var charsToReplace = new RegExp('[' + Object.keys(charMap).join('') + ']', 'g');
    if (reservedWords.indexOf(name) !== -1) {
        // convert identifiers that are reserved words in JS to something safer
        return '__$' + name;
    }
    return name.replace(charsToReplace, function (c) { return charMap[c]; });
}

function parseString(str) {
    return str
        .replace(/\\(u[a-fA-F0-9]{4}|x[a-fA-F0-9]{2})/g, function (match, hex) {
            return String.fromCharCode(parseInt(hex.slice(1), 16));
        })
        .replace(/\\([0-3]?[0-7]{1,2})/g, function (match, oct) {
            return String.fromCharCode(parseInt(oct, 8));
        })
        .replace(/\\0[^0-9]?/g,'\u0000')
        .replace(/\\(?:\r\n?|\n)/g,'')
        .replace(/\\n/g,'\n')
        .replace(/\\r/g,'\r')
        .replace(/\\t/g,'\t')
        .replace(/\\v/g,'\v')
        .replace(/\\f/g,'\f')
        .replace(/\\b/g,'\b')
        .replace(/\\(.)/g, '$1');
}

function processLocsAndRanges(prog, locs, ranges) {
    // this cannot be done 1 pass over all the nodes
    // because some of the loc / range objects point to the same instance in memory
    // so deleting one deletes the other as well
    estraverse.replace(prog, {
        leave: function (node) {
            if (ranges) node.range = node.loc.range || [0, 0];
            return node;
        }
    });

    estraverse.replace(prog, {
        leave: function (node) {
            if (node.loc && typeof node.loc.range !== 'undefined')
                delete node.loc.range;
            if (! locs && typeof node.loc !== 'undefined')
                delete node.loc;
            return node;
        }
    });
}

function getValueIfUndefined(variable, valueIfUndefined) {
    return (typeof variable === 'undefined') ? valueIfUndefined : variable;
}

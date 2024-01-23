{\rtf1\ansi\deff0\nouicompat{\fonttbl{\f0\fnil\fcharset0 Calibri;}}
{\colortbl ;\red0\green0\blue255;}
{\*\generator Riched20 10.0.20348}\viewkind4\uc1 
\pard\sa200\sl276\slmult1\f0\fs22\lang9 //! moment.js\par
//! version : 2.30.1\par
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors\par
//! license : MIT\par
//! momentjs.com\par
\par
;(function (global, factory) \{\par
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :\par
    typeof define === 'function' && define.amd ? define(factory) :\par
    global.moment = factory()\par
\}(this, (function () \{ 'use strict';\par
\par
    var hookCallback;\par
\par
    function hooks() \{\par
        return hookCallback.apply(null, arguments);\par
    \}\par
\par
    // This is done to register the method called with moment()\par
    // without creating circular dependencies.\par
    function setHookCallback(callback) \{\par
        hookCallback = callback;\par
    \}\par
\par
    function isArray(input) \{\par
        return (\par
            input instanceof Array ||\par
            Object.prototype.toString.call(input) === '[object Array]'\par
        );\par
    \}\par
\par
    function isObject(input) \{\par
        // IE8 will treat undefined and null as object if it wasn't for\par
        // input != null\par
        return (\par
            input != null &&\par
            Object.prototype.toString.call(input) === '[object Object]'\par
        );\par
    \}\par
\par
    function hasOwnProp(a, b) \{\par
        return Object.prototype.hasOwnProperty.call(a, b);\par
    \}\par
\par
    function isObjectEmpty(obj) \{\par
        if (Object.getOwnPropertyNames) \{\par
            return Object.getOwnPropertyNames(obj).length === 0;\par
        \} else \{\par
            var k;\par
            for (k in obj) \{\par
                if (hasOwnProp(obj, k)) \{\par
                    return false;\par
                \}\par
            \}\par
            return true;\par
        \}\par
    \}\par
\par
    function isUndefined(input) \{\par
        return input === void 0;\par
    \}\par
\par
    function isNumber(input) \{\par
        return (\par
            typeof input === 'number' ||\par
            Object.prototype.toString.call(input) === '[object Number]'\par
        );\par
    \}\par
\par
    function isDate(input) \{\par
        return (\par
            input instanceof Date ||\par
            Object.prototype.toString.call(input) === '[object Date]'\par
        );\par
    \}\par
\par
    function map(arr, fn) \{\par
        var res = [],\par
            i,\par
            arrLen = arr.length;\par
        for (i = 0; i < arrLen; ++i) \{\par
            res.push(fn(arr[i], i));\par
        \}\par
        return res;\par
    \}\par
\par
    function extend(a, b) \{\par
        for (var i in b) \{\par
            if (hasOwnProp(b, i)) \{\par
                a[i] = b[i];\par
            \}\par
        \}\par
\par
        if (hasOwnProp(b, 'toString')) \{\par
            a.toString = b.toString;\par
        \}\par
\par
        if (hasOwnProp(b, 'valueOf')) \{\par
            a.valueOf = b.valueOf;\par
        \}\par
\par
        return a;\par
    \}\par
\par
    function createUTC(input, format, locale, strict) \{\par
        return createLocalOrUTC(input, format, locale, strict, true).utc();\par
    \}\par
\par
    function defaultParsingFlags() \{\par
        // We need to deep clone this object.\par
        return \{\par
            empty: false,\par
            unusedTokens: [],\par
            unusedInput: [],\par
            overflow: -2,\par
            charsLeftOver: 0,\par
            nullInput: false,\par
            invalidEra: null,\par
            invalidMonth: null,\par
            invalidFormat: false,\par
            userInvalidated: false,\par
            iso: false,\par
            parsedDateParts: [],\par
            era: null,\par
            meridiem: null,\par
            rfc2822: false,\par
            weekdayMismatch: false,\par
        \};\par
    \}\par
\par
    function getParsingFlags(m) \{\par
        if (m._pf == null) \{\par
            m._pf = defaultParsingFlags();\par
        \}\par
        return m._pf;\par
    \}\par
\par
    var some;\par
    if (Array.prototype.some) \{\par
        some = Array.prototype.some;\par
    \} else \{\par
        some = function (fun) \{\par
            var t = Object(this),\par
                len = t.length >>> 0,\par
                i;\par
\par
            for (i = 0; i < len; i++) \{\par
                if (i in t && fun.call(this, t[i], i, t)) \{\par
                    return true;\par
                \}\par
            \}\par
\par
            return false;\par
        \};\par
    \}\par
\par
    function isValid(m) \{\par
        var flags = null,\par
            parsedParts = false,\par
            isNowValid = m._d && !isNaN(m._d.getTime());\par
        if (isNowValid) \{\par
            flags = getParsingFlags(m);\par
            parsedParts = some.call(flags.parsedDateParts, function (i) \{\par
                return i != null;\par
            \});\par
            isNowValid =\par
                flags.overflow < 0 &&\par
                !flags.empty &&\par
                !flags.invalidEra &&\par
                !flags.invalidMonth &&\par
                !flags.invalidWeekday &&\par
                !flags.weekdayMismatch &&\par
                !flags.nullInput &&\par
                !flags.invalidFormat &&\par
                !flags.userInvalidated &&\par
                (!flags.meridiem || (flags.meridiem && parsedParts));\par
            if (m._strict) \{\par
                isNowValid =\par
                    isNowValid &&\par
                    flags.charsLeftOver === 0 &&\par
                    flags.unusedTokens.length === 0 &&\par
                    flags.bigHour === undefined;\par
            \}\par
        \}\par
        if (Object.isFrozen == null || !Object.isFrozen(m)) \{\par
            m._isValid = isNowValid;\par
        \} else \{\par
            return isNowValid;\par
        \}\par
        return m._isValid;\par
    \}\par
\par
    function createInvalid(flags) \{\par
        var m = createUTC(NaN);\par
        if (flags != null) \{\par
            extend(getParsingFlags(m), flags);\par
        \} else \{\par
            getParsingFlags(m).userInvalidated = true;\par
        \}\par
\par
        return m;\par
    \}\par
\par
    // Plugins that add properties should also add the key here (null value),\par
    // so we can properly clone ourselves.\par
    var momentProperties = (hooks.momentProperties = []),\par
        updateInProgress = false;\par
\par
    function copyConfig(to, from) \{\par
        var i,\par
            prop,\par
            val,\par
            momentPropertiesLen = momentProperties.length;\par
\par
        if (!isUndefined(from._isAMomentObject)) \{\par
            to._isAMomentObject = from._isAMomentObject;\par
        \}\par
        if (!isUndefined(from._i)) \{\par
            to._i = from._i;\par
        \}\par
        if (!isUndefined(from._f)) \{\par
            to._f = from._f;\par
        \}\par
        if (!isUndefined(from._l)) \{\par
            to._l = from._l;\par
        \}\par
        if (!isUndefined(from._strict)) \{\par
            to._strict = from._strict;\par
        \}\par
        if (!isUndefined(from._tzm)) \{\par
            to._tzm = from._tzm;\par
        \}\par
        if (!isUndefined(from._isUTC)) \{\par
            to._isUTC = from._isUTC;\par
        \}\par
        if (!isUndefined(from._offset)) \{\par
            to._offset = from._offset;\par
        \}\par
        if (!isUndefined(from._pf)) \{\par
            to._pf = getParsingFlags(from);\par
        \}\par
        if (!isUndefined(from._locale)) \{\par
            to._locale = from._locale;\par
        \}\par
\par
        if (momentPropertiesLen > 0) \{\par
            for (i = 0; i < momentPropertiesLen; i++) \{\par
                prop = momentProperties[i];\par
                val = from[prop];\par
                if (!isUndefined(val)) \{\par
                    to[prop] = val;\par
                \}\par
            \}\par
        \}\par
\par
        return to;\par
    \}\par
\par
    // Moment prototype object\par
    function Moment(config) \{\par
        copyConfig(this, config);\par
        this._d = new Date(config._d != null ? config._d.getTime() : NaN);\par
        if (!this.isValid()) \{\par
            this._d = new Date(NaN);\par
        \}\par
        // Prevent infinite loop in case updateOffset creates new moment\par
        // objects.\par
        if (updateInProgress === false) \{\par
            updateInProgress = true;\par
            hooks.updateOffset(this);\par
            updateInProgress = false;\par
        \}\par
    \}\par
\par
    function isMoment(obj) \{\par
        return (\par
            obj instanceof Moment || (obj != null && obj._isAMomentObject != null)\par
        );\par
    \}\par
\par
    function warn(msg) \{\par
        if (\par
            hooks.suppressDeprecationWarnings === false &&\par
            typeof console !== 'undefined' &&\par
            console.warn\par
        ) \{\par
            console.warn('Deprecation warning: ' + msg);\par
        \}\par
    \}\par
\par
    function deprecate(msg, fn) \{\par
        var firstTime = true;\par
\par
        return extend(function () \{\par
            if (hooks.deprecationHandler != null) \{\par
                hooks.deprecationHandler(null, msg);\par
            \}\par
            if (firstTime) \{\par
                var args = [],\par
                    arg,\par
                    i,\par
                    key,\par
                    argLen = arguments.length;\par
                for (i = 0; i < argLen; i++) \{\par
                    arg = '';\par
                    if (typeof arguments[i] === 'object') \{\par
                        arg += '\\n[' + i + '] ';\par
                        for (key in arguments[0]) \{\par
                            if (hasOwnProp(arguments[0], key)) \{\par
                                arg += key + ': ' + arguments[0][key] + ', ';\par
                            \}\par
                        \}\par
                        arg = arg.slice(0, -2); // Remove trailing comma and space\par
                    \} else \{\par
                        arg = arguments[i];\par
                    \}\par
                    args.push(arg);\par
                \}\par
                warn(\par
                    msg +\par
                        '\\nArguments: ' +\par
                        Array.prototype.slice.call(args).join('') +\par
                        '\\n' +\par
                        new Error().stack\par
                );\par
                firstTime = false;\par
            \}\par
            return fn.apply(this, arguments);\par
        \}, fn);\par
    \}\par
\par
    var deprecations = \{\};\par
\par
    function deprecateSimple(name, msg) \{\par
        if (hooks.deprecationHandler != null) \{\par
            hooks.deprecationHandler(name, msg);\par
        \}\par
        if (!deprecations[name]) \{\par
            warn(msg);\par
            deprecations[name] = true;\par
        \}\par
    \}\par
\par
    hooks.suppressDeprecationWarnings = false;\par
    hooks.deprecationHandler = null;\par
\par
    function isFunction(input) \{\par
        return (\par
            (typeof Function !== 'undefined' && input instanceof Function) ||\par
            Object.prototype.toString.call(input) === '[object Function]'\par
        );\par
    \}\par
\par
    function set(config) \{\par
        var prop, i;\par
        for (i in config) \{\par
            if (hasOwnProp(config, i)) \{\par
                prop = config[i];\par
                if (isFunction(prop)) \{\par
                    this[i] = prop;\par
                \} else \{\par
                    this['_' + i] = prop;\par
                \}\par
            \}\par
        \}\par
        this._config = config;\par
        // Lenient ordinal parsing accepts just a number in addition to\par
        // number + (possibly) stuff coming from _dayOfMonthOrdinalParse.\par
        // TODO: Remove "ordinalParse" fallback in next major release.\par
        this._dayOfMonthOrdinalParseLenient = new RegExp(\par
            (this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) +\par
                '|' +\par
                /\\d\{1,2\}/.source\par
        );\par
    \}\par
\par
    function mergeConfigs(parentConfig, childConfig) \{\par
        var res = extend(\{\}, parentConfig),\par
            prop;\par
        for (prop in childConfig) \{\par
            if (hasOwnProp(childConfig, prop)) \{\par
                if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) \{\par
                    res[prop] = \{\};\par
                    extend(res[prop], parentConfig[prop]);\par
                    extend(res[prop], childConfig[prop]);\par
                \} else if (childConfig[prop] != null) \{\par
                    res[prop] = childConfig[prop];\par
                \} else \{\par
                    delete res[prop];\par
                \}\par
            \}\par
        \}\par
        for (prop in parentConfig) \{\par
            if (\par
                hasOwnProp(parentConfig, prop) &&\par
                !hasOwnProp(childConfig, prop) &&\par
                isObject(parentConfig[prop])\par
            ) \{\par
                // make sure changes to properties don't modify parent config\par
                res[prop] = extend(\{\}, res[prop]);\par
            \}\par
        \}\par
        return res;\par
    \}\par
\par
    function Locale(config) \{\par
        if (config != null) \{\par
            this.set(config);\par
        \}\par
    \}\par
\par
    var keys;\par
\par
    if (Object.keys) \{\par
        keys = Object.keys;\par
    \} else \{\par
        keys = function (obj) \{\par
            var i,\par
                res = [];\par
            for (i in obj) \{\par
                if (hasOwnProp(obj, i)) \{\par
                    res.push(i);\par
                \}\par
            \}\par
            return res;\par
        \};\par
    \}\par
\par
    var defaultCalendar = \{\par
        sameDay: '[Today at] LT',\par
        nextDay: '[Tomorrow at] LT',\par
        nextWeek: 'dddd [at] LT',\par
        lastDay: '[Yesterday at] LT',\par
        lastWeek: '[Last] dddd [at] LT',\par
        sameElse: 'L',\par
    \};\par
\par
    function calendar(key, mom, now) \{\par
        var output = this._calendar[key] || this._calendar['sameElse'];\par
        return isFunction(output) ? output.call(mom, now) : output;\par
    \}\par
\par
    function zeroFill(number, targetLength, forceSign) \{\par
        var absNumber = '' + Math.abs(number),\par
            zerosToFill = targetLength - absNumber.length,\par
            sign = number >= 0;\par
        return (\par
            (sign ? (forceSign ? '+' : '') : '-') +\par
            Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) +\par
            absNumber\par
        );\par
    \}\par
\par
    var formattingTokens =\par
            /(\\[[^\\[]*\\])|(\\\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|N\{1,5\}|YYYYYY|YYYYY|YYYY|YY|y\{2,4\}|yo?|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S\{1,9\}|x|X|zz?|ZZ?|.)/g,\par
        localFormattingTokens = /(\\[[^\\[]*\\])|(\\\\)?(LTS|LT|LL?L?L?|l\{1,4\})/g,\par
        formatFunctions = \{\},\par
        formatTokenFunctions = \{\};\par
\par
    // token:    'M'\par
    // padded:   ['MM', 2]\par
    // ordinal:  'Mo'\par
    // callback: function () \{ this.month() + 1 \}\par
    function addFormatToken(token, padded, ordinal, callback) \{\par
        var func = callback;\par
        if (typeof callback === 'string') \{\par
            func = function () \{\par
                return this[callback]();\par
            \};\par
        \}\par
        if (token) \{\par
            formatTokenFunctions[token] = func;\par
        \}\par
        if (padded) \{\par
            formatTokenFunctions[padded[0]] = function () \{\par
                return zeroFill(func.apply(this, arguments), padded[1], padded[2]);\par
            \};\par
        \}\par
        if (ordinal) \{\par
            formatTokenFunctions[ordinal] = function () \{\par
                return this.localeData().ordinal(\par
                    func.apply(this, arguments),\par
                    token\par
                );\par
            \};\par
        \}\par
    \}\par
\par
    function removeFormattingTokens(input) \{\par
        if (input.match(/\\[[\\s\\S]/)) \{\par
            return input.replace(/^\\[|\\]$/g, '');\par
        \}\par
        return input.replace(/\\\\/g, '');\par
    \}\par
\par
    function makeFormatFunction(format) \{\par
        var array = format.match(formattingTokens),\par
            i,\par
            length;\par
\par
        for (i = 0, length = array.length; i < length; i++) \{\par
            if (formatTokenFunctions[array[i]]) \{\par
                array[i] = formatTokenFunctions[array[i]];\par
            \} else \{\par
                array[i] = removeFormattingTokens(array[i]);\par
            \}\par
        \}\par
\par
        return function (mom) \{\par
            var output = '',\par
                i;\par
            for (i = 0; i < length; i++) \{\par
                output += isFunction(array[i])\par
                    ? array[i].call(mom, format)\par
                    : array[i];\par
            \}\par
            return output;\par
        \};\par
    \}\par
\par
    // format date using native date object\par
    function formatMoment(m, format) \{\par
        if (!m.isValid()) \{\par
            return m.localeData().invalidDate();\par
        \}\par
\par
        format = expandFormat(format, m.localeData());\par
        formatFunctions[format] =\par
            formatFunctions[format] || makeFormatFunction(format);\par
\par
        return formatFunctions[format](m);\par
    \}\par
\par
    function expandFormat(format, locale) \{\par
        var i = 5;\par
\par
        function replaceLongDateFormatTokens(input) \{\par
            return locale.longDateFormat(input) || input;\par
        \}\par
\par
        localFormattingTokens.lastIndex = 0;\par
        while (i >= 0 && localFormattingTokens.test(format)) \{\par
            format = format.replace(\par
                localFormattingTokens,\par
                replaceLongDateFormatTokens\par
            );\par
            localFormattingTokens.lastIndex = 0;\par
            i -= 1;\par
        \}\par
\par
        return format;\par
    \}\par
\par
    var defaultLongDateFormat = \{\par
        LTS: 'h:mm:ss A',\par
        LT: 'h:mm A',\par
        L: 'MM/DD/YYYY',\par
        LL: 'MMMM D, YYYY',\par
        LLL: 'MMMM D, YYYY h:mm A',\par
        LLLL: 'dddd, MMMM D, YYYY h:mm A',\par
    \};\par
\par
    function longDateFormat(key) \{\par
        var format = this._longDateFormat[key],\par
            formatUpper = this._longDateFormat[key.toUpperCase()];\par
\par
        if (format || !formatUpper) \{\par
            return format;\par
        \}\par
\par
        this._longDateFormat[key] = formatUpper\par
            .match(formattingTokens)\par
            .map(function (tok) \{\par
                if (\par
                    tok === 'MMMM' ||\par
                    tok === 'MM' ||\par
                    tok === 'DD' ||\par
                    tok === 'dddd'\par
                ) \{\par
                    return tok.slice(1);\par
                \}\par
                return tok;\par
            \})\par
            .join('');\par
\par
        return this._longDateFormat[key];\par
    \}\par
\par
    var defaultInvalidDate = 'Invalid date';\par
\par
    function invalidDate() \{\par
        return this._invalidDate;\par
    \}\par
\par
    var defaultOrdinal = '%d',\par
        defaultDayOfMonthOrdinalParse = /\\d\{1,2\}/;\par
\par
    function ordinal(number) \{\par
        return this._ordinal.replace('%d', number);\par
    \}\par
\par
    var defaultRelativeTime = \{\par
        future: 'in %s',\par
        past: '%s ago',\par
        s: 'a few seconds',\par
        ss: '%d seconds',\par
        m: 'a minute',\par
        mm: '%d minutes',\par
        h: 'an hour',\par
        hh: '%d hours',\par
        d: 'a day',\par
        dd: '%d days',\par
        w: 'a week',\par
        ww: '%d weeks',\par
        M: 'a month',\par
        MM: '%d months',\par
        y: 'a year',\par
        yy: '%d years',\par
    \};\par
\par
    function relativeTime(number, withoutSuffix, string, isFuture) \{\par
        var output = this._relativeTime[string];\par
        return isFunction(output)\par
            ? output(number, withoutSuffix, string, isFuture)\par
            : output.replace(/%d/i, number);\par
    \}\par
\par
    function pastFuture(diff, output) \{\par
        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];\par
        return isFunction(format) ? format(output) : format.replace(/%s/i, output);\par
    \}\par
\par
    var aliases = \{\par
        D: 'date',\par
        dates: 'date',\par
        date: 'date',\par
        d: 'day',\par
        days: 'day',\par
        day: 'day',\par
        e: 'weekday',\par
        weekdays: 'weekday',\par
        weekday: 'weekday',\par
        E: 'isoWeekday',\par
        isoweekdays: 'isoWeekday',\par
        isoweekday: 'isoWeekday',\par
        DDD: 'dayOfYear',\par
        dayofyears: 'dayOfYear',\par
        dayofyear: 'dayOfYear',\par
        h: 'hour',\par
        hours: 'hour',\par
        hour: 'hour',\par
        ms: 'millisecond',\par
        milliseconds: 'millisecond',\par
        millisecond: 'millisecond',\par
        m: 'minute',\par
        minutes: 'minute',\par
        minute: 'minute',\par
        M: 'month',\par
        months: 'month',\par
        month: 'month',\par
        Q: 'quarter',\par
        quarters: 'quarter',\par
        quarter: 'quarter',\par
        s: 'second',\par
        seconds: 'second',\par
        second: 'second',\par
        gg: 'weekYear',\par
        weekyears: 'weekYear',\par
        weekyear: 'weekYear',\par
        GG: 'isoWeekYear',\par
        isoweekyears: 'isoWeekYear',\par
        isoweekyear: 'isoWeekYear',\par
        w: 'week',\par
        weeks: 'week',\par
        week: 'week',\par
        W: 'isoWeek',\par
        isoweeks: 'isoWeek',\par
        isoweek: 'isoWeek',\par
        y: 'year',\par
        years: 'year',\par
        year: 'year',\par
    \};\par
\par
    function normalizeUnits(units) \{\par
        return typeof units === 'string'\par
            ? aliases[units] || aliases[units.toLowerCase()]\par
            : undefined;\par
    \}\par
\par
    function normalizeObjectUnits(inputObject) \{\par
        var normalizedInput = \{\},\par
            normalizedProp,\par
            prop;\par
\par
        for (prop in inputObject) \{\par
            if (hasOwnProp(inputObject, prop)) \{\par
                normalizedProp = normalizeUnits(prop);\par
                if (normalizedProp) \{\par
                    normalizedInput[normalizedProp] = inputObject[prop];\par
                \}\par
            \}\par
        \}\par
\par
        return normalizedInput;\par
    \}\par
\par
    var priorities = \{\par
        date: 9,\par
        day: 11,\par
        weekday: 11,\par
        isoWeekday: 11,\par
        dayOfYear: 4,\par
        hour: 13,\par
        millisecond: 16,\par
        minute: 14,\par
        month: 8,\par
        quarter: 7,\par
        second: 15,\par
        weekYear: 1,\par
        isoWeekYear: 1,\par
        week: 5,\par
        isoWeek: 5,\par
        year: 1,\par
    \};\par
\par
    function getPrioritizedUnits(unitsObj) \{\par
        var units = [],\par
            u;\par
        for (u in unitsObj) \{\par
            if (hasOwnProp(unitsObj, u)) \{\par
                units.push(\{ unit: u, priority: priorities[u] \});\par
            \}\par
        \}\par
        units.sort(function (a, b) \{\par
            return a.priority - b.priority;\par
        \});\par
        return units;\par
    \}\par
\par
    var match1 = /\\d/, //       0 - 9\par
        match2 = /\\d\\d/, //      00 - 99\par
        match3 = /\\d\{3\}/, //     000 - 999\par
        match4 = /\\d\{4\}/, //    0000 - 9999\par
        match6 = /[+-]?\\d\{6\}/, // -999999 - 999999\par
        match1to2 = /\\d\\d?/, //       0 - 99\par
        match3to4 = /\\d\\d\\d\\d?/, //     999 - 9999\par
        match5to6 = /\\d\\d\\d\\d\\d\\d?/, //   99999 - 999999\par
        match1to3 = /\\d\{1,3\}/, //       0 - 999\par
        match1to4 = /\\d\{1,4\}/, //       0 - 9999\par
        match1to6 = /[+-]?\\d\{1,6\}/, // -999999 - 999999\par
        matchUnsigned = /\\d+/, //       0 - inf\par
        matchSigned = /[+-]?\\d+/, //    -inf - inf\par
        matchOffset = /Z|[+-]\\d\\d:?\\d\\d/gi, // +00:00 -00:00 +0000 -0000 or Z\par
        matchShortOffset = /Z|[+-]\\d\\d(?::?\\d\\d)?/gi, // +00 -00 +00:00 -00:00 +0000 -0000 or Z\par
        matchTimestamp = /[+-]?\\d+(\\.\\d\{1,3\})?/, // 123456789 123456789.123\par
        // any word (or two) characters or numbers including two/three word month in arabic.\par
        // includes scottish gaelic two word and hyphenated months\par
        matchWord =\par
            /[0-9]\{0,256\}['a-z\\u00A0-\\u05FF\\u0700-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFF07\\uFF10-\\uFFEF]\{1,256\}|[\\u0600-\\u06FF\\/]\{1,256\}(\\s*?[\\u0600-\\u06FF]\{1,256\})\{1,2\}/i,\par
        match1to2NoLeadingZero = /^[1-9]\\d?/, //         1-99\par
        match1to2HasZero = /^([1-9]\\d|\\d)/, //           0-99\par
        regexes;\par
\par
    regexes = \{\};\par
\par
    function addRegexToken(token, regex, strictRegex) \{\par
        regexes[token] = isFunction(regex)\par
            ? regex\par
            : function (isStrict, localeData) \{\par
                  return isStrict && strictRegex ? strictRegex : regex;\par
              \};\par
    \}\par
\par
    function getParseRegexForToken(token, config) \{\par
        if (!hasOwnProp(regexes, token)) \{\par
            return new RegExp(unescapeFormat(token));\par
        \}\par
\par
        return regexes[token](config._strict, config._locale);\par
    \}\par
\par
    // Code from {{\field{\*\fldinst{HYPERLINK http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript }}{\fldrslt{http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript\ul0\cf0}}}}\f0\fs22\par
    function unescapeFormat(s) \{\par
        return regexEscape(\par
            s\par
                .replace('\\\\', '')\par
                .replace(\par
                    /\\\\(\\[)|\\\\(\\])|\\[([^\\]\\[]*)\\]|\\\\(.)/g,\par
                    function (matched, p1, p2, p3, p4) \{\par
                        return p1 || p2 || p3 || p4;\par
                    \}\par
                )\par
        );\par
    \}\par
\par
    function regexEscape(s) \{\par
        return s.replace(/[-\\/\\\\^$*+?.()|[\\]\{\}]/g, '{{\field{\*\fldinst{HYPERLINK "\\\\\\\\$&"}}{\fldrslt{\\\\$&\ul0\cf0}}}}\f0\fs22 ');\par
    \}\par
\par
    function absFloor(number) \{\par
        if (number < 0) \{\par
            // -0 -> 0\par
            return Math.ceil(number) || 0;\par
        \} else \{\par
            return Math.floor(number);\par
        \}\par
    \}\par
\par
    function toInt(argumentForCoercion) \{\par
        var coercedNumber = +argumentForCoercion,\par
            value = 0;\par
\par
        if (coercedNumber !== 0 && isFinite(coercedNumber)) \{\par
            value = absFloor(coercedNumber);\par
        \}\par
\par
        return value;\par
    \}\par
\par
    var tokens = \{\};\par
\par
    function addParseToken(token, callback) \{\par
        var i,\par
            func = callback,\par
            tokenLen;\par
        if (typeof token === 'string') \{\par
            token = [token];\par
        \}\par
        if (isNumber(callback)) \{\par
            func = function (input, array) \{\par
                array[callback] = toInt(input);\par
            \};\par
        \}\par
        tokenLen = token.length;\par
        for (i = 0; i < tokenLen; i++) \{\par
            tokens[token[i]] = func;\par
        \}\par
    \}\par
\par
    function addWeekParseToken(token, callback) \{\par
        addParseToken(token, function (input, array, config, token) \{\par
            config._w = config._w || \{\};\par
            callback(input, config._w, config, token);\par
        \});\par
    \}\par
\par
    function addTimeToArrayFromToken(token, input, config) \{\par
        if (input != null && hasOwnProp(tokens, token)) \{\par
            tokens[token](input, config._a, config, token);\par
        \}\par
    \}\par
\par
    function isLeapYear(year) \{\par
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;\par
    \}\par
\par
    var YEAR = 0,\par
        MONTH = 1,\par
        DATE = 2,\par
        HOUR = 3,\par
        MINUTE = 4,\par
        SECOND = 5,\par
        MILLISECOND = 6,\par
        WEEK = 7,\par
        WEEKDAY = 8;\par
\par
    // FORMATTING\par
\par
    addFormatToken('Y', 0, 0, function () \{\par
        var y = this.year();\par
        return y <= 9999 ? zeroFill(y, 4) : '+' + y;\par
    \});\par
\par
    addFormatToken(0, ['YY', 2], 0, function () \{\par
        return this.year() % 100;\par
    \});\par
\par
    addFormatToken(0, ['YYYY', 4], 0, 'year');\par
    addFormatToken(0, ['YYYYY', 5], 0, 'year');\par
    addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');\par
\par
    // PARSING\par
\par
    addRegexToken('Y', matchSigned);\par
    addRegexToken('YY', match1to2, match2);\par
    addRegexToken('YYYY', match1to4, match4);\par
    addRegexToken('YYYYY', match1to6, match6);\par
    addRegexToken('YYYYYY', match1to6, match6);\par
\par
    addParseToken(['YYYYY', 'YYYYYY'], YEAR);\par
    addParseToken('YYYY', function (input, array) \{\par
        array[YEAR] =\par
            input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);\par
    \});\par
    addParseToken('YY', function (input, array) \{\par
        array[YEAR] = hooks.parseTwoDigitYear(input);\par
    \});\par
    addParseToken('Y', function (input, array) \{\par
        array[YEAR] = parseInt(input, 10);\par
    \});\par
\par
    // HELPERS\par
\par
    function daysInYear(year) \{\par
        return isLeapYear(year) ? 366 : 365;\par
    \}\par
\par
    // HOOKS\par
\par
    hooks.parseTwoDigitYear = function (input) \{\par
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);\par
    \};\par
\par
    // MOMENTS\par
\par
    var getSetYear = makeGetSet('FullYear', true);\par
\par
    function getIsLeapYear() \{\par
        return isLeapYear(this.year());\par
    \}\par
\par
    function makeGetSet(unit, keepTime) \{\par
        return function (value) \{\par
            if (value != null) \{\par
                set$1(this, unit, value);\par
                hooks.updateOffset(this, keepTime);\par
                return this;\par
            \} else \{\par
                return get(this, unit);\par
            \}\par
        \};\par
    \}\par
\par
    function get(mom, unit) \{\par
        if (!mom.isValid()) \{\par
            return NaN;\par
        \}\par
\par
        var d = mom._d,\par
            isUTC = mom._isUTC;\par
\par
        switch (unit) \{\par
            case 'Milliseconds':\par
                return isUTC ? d.getUTCMilliseconds() : d.getMilliseconds();\par
            case 'Seconds':\par
                return isUTC ? d.getUTCSeconds() : d.getSeconds();\par
            case 'Minutes':\par
                return isUTC ? d.getUTCMinutes() : d.getMinutes();\par
            case 'Hours':\par
                return isUTC ? d.getUTCHours() : d.getHours();\par
            case 'Date':\par
                return isUTC ? d.getUTCDate() : d.getDate();\par
            case 'Day':\par
                return isUTC ? d.getUTCDay() : d.getDay();\par
            case 'Month':\par
                return isUTC ? d.getUTCMonth() : d.getMonth();\par
            case 'FullYear':\par
                return isUTC ? d.getUTCFullYear() : d.getFullYear();\par
            default:\par
                return NaN; // Just in case\par
        \}\par
    \}\par
\par
    function set$1(mom, unit, value) \{\par
        var d, isUTC, year, month, date;\par
\par
        if (!mom.isValid() || isNaN(value)) \{\par
            return;\par
        \}\par
\par
        d = mom._d;\par
        isUTC = mom._isUTC;\par
\par
        switch (unit) \{\par
            case 'Milliseconds':\par
                return void (isUTC\par
                    ? d.setUTCMilliseconds(value)\par
                    : d.setMilliseconds(value));\par
            case 'Seconds':\par
                return void (isUTC ? d.setUTCSeconds(value) : d.setSeconds(value));\par
            case 'Minutes':\par
                return void (isUTC ? d.setUTCMinutes(value) : d.setMinutes(value));\par
            case 'Hours':\par
                return void (isUTC ? d.setUTCHours(value) : d.setHours(value));\par
            case 'Date':\par
                return void (isUTC ? d.setUTCDate(value) : d.setDate(value));\par
            // case 'Day': // Not real\par
            //    return void (isUTC ? d.setUTCDay(value) : d.setDay(value));\par
            // case 'Month': // Not used because we need to pass two variables\par
            //     return void (isUTC ? d.setUTCMonth(value) : d.setMonth(value));\par
            case 'FullYear':\par
                break; // See below ...\par
            default:\par
                return; // Just in case\par
        \}\par
\par
        year = value;\par
        month = mom.month();\par
        date = mom.date();\par
        date = date === 29 && month === 1 && !isLeapYear(year) ? 28 : date;\par
        void (isUTC\par
            ? d.setUTCFullYear(year, month, date)\par
            : d.setFullYear(year, month, date));\par
    \}\par
\par
    // MOMENTS\par
\par
    function stringGet(units) \{\par
        units = normalizeUnits(units);\par
        if (isFunction(this[units])) \{\par
            return this[units]();\par
        \}\par
        return this;\par
    \}\par
\par
    function stringSet(units, value) \{\par
        if (typeof units === 'object') \{\par
            units = normalizeObjectUnits(units);\par
            var prioritized = getPrioritizedUnits(units),\par
                i,\par
                prioritizedLen = prioritized.length;\par
            for (i = 0; i < prioritizedLen; i++) \{\par
                this[prioritized[i].unit](units[prioritized[i].unit]);\par
            \}\par
        \} else \{\par
            units = normalizeUnits(units);\par
            if (isFunction(this[units])) \{\par
                return this[units](value);\par
            \}\par
        \}\par
        return this;\par
    \}\par
\par
    function mod(n, x) \{\par
        return ((n % x) + x) % x;\par
    \}\par
\par
    var indexOf;\par
\par
    if (Array.prototype.indexOf) \{\par
        indexOf = Array.prototype.indexOf;\par
    \} else \{\par
        indexOf = function (o) \{\par
            // I know\par
            var i;\par
            for (i = 0; i < this.length; ++i) \{\par
                if (this[i] === o) \{\par
                    return i;\par
                \}\par
            \}\par
            return -1;\par
        \};\par
    \}\par
\par
    function daysInMonth(year, month) \{\par
        if (isNaN(year) || isNaN(month)) \{\par
            return NaN;\par
        \}\par
        var modMonth = mod(month, 12);\par
        year += (month - modMonth) / 12;\par
        return modMonth === 1\par
            ? isLeapYear(year)\par
                ? 29\par
                : 28\par
            : 31 - ((modMonth % 7) % 2);\par
    \}\par
\par
    // FORMATTING\par
\par
    addFormatToken('M', ['MM', 2], 'Mo', function () \{\par
        return this.month() + 1;\par
    \});\par
\par
    addFormatToken('MMM', 0, 0, function (format) \{\par
        return this.localeData().monthsShort(this, format);\par
    \});\par
\par
    addFormatToken('MMMM', 0, 0, function (format) \{\par
        return this.localeData().months(this, format);\par
    \});\par
\par
    // PARSING\par
\par
    addRegexToken('M', match1to2, match1to2NoLeadingZero);\par
    addRegexToken('MM', match1to2, match2);\par
    addRegexToken('MMM', function (isStrict, locale) \{\par
        return locale.monthsShortRegex(isStrict);\par
    \});\par
    addRegexToken('MMMM', function (isStrict, locale) \{\par
        return locale.monthsRegex(isStrict);\par
    \});\par
\par
    addParseToken(['M', 'MM'], function (input, array) \{\par
        array[MONTH] = toInt(input) - 1;\par
    \});\par
\par
    addParseToken(['MMM', 'MMMM'], function (input, array, config, token) \{\par
        var month = config._locale.monthsParse(input, token, config._strict);\par
        // if we didn't find a month name, mark the date as invalid.\par
        if (month != null) \{\par
            array[MONTH] = month;\par
        \} else \{\par
            getParsingFlags(config).invalidMonth = input;\par
        \}\par
    \});\par
\par
    // LOCALES\par
\par
    var defaultLocaleMonths =\par
            'January_February_March_April_May_June_July_August_September_October_November_December'.split(\par
                '_'\par
            ),\par
        defaultLocaleMonthsShort =\par
            'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),\par
        MONTHS_IN_FORMAT = /D[oD]?(\\[[^\\[\\]]*\\]|\\s)+MMMM?/,\par
        defaultMonthsShortRegex = matchWord,\par
        defaultMonthsRegex = matchWord;\par
\par
    function localeMonths(m, format) \{\par
        if (!m) \{\par
            return isArray(this._months)\par
                ? this._months\par
                : this._months['standalone'];\par
        \}\par
        return isArray(this._months)\par
            ? this._months[m.month()]\par
            : this._months[\par
                  (this._months.isFormat || MONTHS_IN_FORMAT).test(format)\par
                      ? 'format'\par
                      : 'standalone'\par
              ][m.month()];\par
    \}\par
\par
    function localeMonthsShort(m, format) \{\par
        if (!m) \{\par
            return isArray(this._monthsShort)\par
                ? this._monthsShort\par
                : this._monthsShort['standalone'];\par
        \}\par
        return isArray(this._monthsShort)\par
            ? this._monthsShort[m.month()]\par
            : this._monthsShort[\par
                  MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'\par
              ][m.month()];\par
    \}\par
\par
    function handleStrictParse(monthName, format, strict) \{\par
        var i,\par
            ii,\par
            mom,\par
            llc = monthName.toLocaleLowerCase();\par
        if (!this._monthsParse) \{\par
            // this is not used\par
            this._monthsParse = [];\par
            this._longMonthsParse = [];\par
            this._shortMonthsParse = [];\par
            for (i = 0; i < 12; ++i) \{\par
                mom = createUTC([2000, i]);\par
                this._shortMonthsParse[i] = this.monthsShort(\par
                    mom,\par
                    ''\par
                ).toLocaleLowerCase();\par
                this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();\par
            \}\par
        \}\par
\par
        if (strict) \{\par
            if (format === 'MMM') \{\par
                ii = indexOf.call(this._shortMonthsParse, llc);\par
                return ii !== -1 ? ii : null;\par
            \} else \{\par
                ii = indexOf.call(this._longMonthsParse, llc);\par
                return ii !== -1 ? ii : null;\par
            \}\par
        \} else \{\par
            if (format === 'MMM') \{\par
                ii = indexOf.call(this._shortMonthsParse, llc);\par
                if (ii !== -1) \{\par
                    return ii;\par
                \}\par
                ii = indexOf.call(this._longMonthsParse, llc);\par
                return ii !== -1 ? ii : null;\par
            \} else \{\par
                ii = indexOf.call(this._longMonthsParse, llc);\par
                if (ii !== -1) \{\par
                    return ii;\par
                \}\par
                ii = indexOf.call(this._shortMonthsParse, llc);\par
                return ii !== -1 ? ii : null;\par
            \}\par
        \}\par
    \}\par
\par
    function localeMonthsParse(monthName, format, strict) \{\par
        var i, mom, regex;\par
\par
        if (this._monthsParseExact) \{\par
            return handleStrictParse.call(this, monthName, format, strict);\par
        \}\par
\par
        if (!this._monthsParse) \{\par
            this._monthsParse = [];\par
            this._longMonthsParse = [];\par
            this._shortMonthsParse = [];\par
        \}\par
\par
        // TODO: add sorting\par
        // Sorting makes sure if one month (or abbr) is a prefix of another\par
        // see sorting in computeMonthsParse\par
        for (i = 0; i < 12; i++) \{\par
            // make the regex if we don't have it already\par
            mom = createUTC([2000, i]);\par
            if (strict && !this._longMonthsParse[i]) \{\par
                this._longMonthsParse[i] = new RegExp(\par
                    '^' + this.months(mom, '').replace('.', '') + '$',\par
                    'i'\par
                );\par
                this._shortMonthsParse[i] = new RegExp(\par
                    '^' + this.monthsShort(mom, '').replace('.', '') + '$',\par
                    'i'\par
                );\par
            \}\par
            if (!strict && !this._monthsParse[i]) \{\par
                regex =\par
                    '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');\par
                this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');\par
            \}\par
            // test the regex\par
            if (\par
                strict &&\par
                format === 'MMMM' &&\par
                this._longMonthsParse[i].test(monthName)\par
            ) \{\par
                return i;\par
            \} else if (\par
                strict &&\par
                format === 'MMM' &&\par
                this._shortMonthsParse[i].test(monthName)\par
            ) \{\par
                return i;\par
            \} else if (!strict && this._monthsParse[i].test(monthName)) \{\par
                return i;\par
            \}\par
        \}\par
    \}\par
\par
    // MOMENTS\par
\par
    function setMonth(mom, value) \{\par
        if (!mom.isValid()) \{\par
            // No op\par
            return mom;\par
        \}\par
\par
        if (typeof value === 'string') \{\par
            if (/^\\d+$/.test(value)) \{\par
                value = toInt(value);\par
            \} else \{\par
                value = mom.localeData().monthsParse(value);\par
                // TODO: Another silent failure?\par
                if (!isNumber(value)) \{\par
                    return mom;\par
                \}\par
            \}\par
        \}\par
\par
        var month = value,\par
            date = mom.date();\par
\par
        date = date < 29 ? date : Math.min(date, daysInMonth(mom.year(), month));\par
        void (mom._isUTC\par
            ? mom._d.setUTCMonth(month, date)\par
            : mom._d.setMonth(month, date));\par
        return mom;\par
    \}\par
\par
    function getSetMonth(value) \{\par
        if (value != null) \{\par
            setMonth(this, value);\par
            hooks.updateOffset(this, true);\par
            return this;\par
        \} else \{\par
            return get(this, 'Month');\par
        \}\par
    \}\par
\par
    function getDaysInMonth() \{\par
        return daysInMonth(this.year(), this.month());\par
    \}\par
\par
    function monthsShortRegex(isStrict) \{\par
        if (this._monthsParseExact) \{\par
            if (!hasOwnProp(this, '_monthsRegex')) \{\par
                computeMonthsParse.call(this);\par
            \}\par
            if (isStrict) \{\par
                return this._monthsShortStrictRegex;\par
            \} else \{\par
                return this._monthsShortRegex;\par
            \}\par
        \} else \{\par
            if (!hasOwnProp(this, '_monthsShortRegex')) \{\par
                this._monthsShortRegex = defaultMonthsShortRegex;\par
            \}\par
            return this._monthsShortStrictRegex && isStrict\par
                ? this._monthsShortStrictRegex\par
                : this._monthsShortRegex;\par
        \}\par
    \}\par
\par
    function monthsRegex(isStrict) \{\par
        if (this._monthsParseExact) \{\par
            if (!hasOwnProp(this, '_monthsRegex')) \{\par
                computeMonthsParse.call(this);\par
            \}\par
            if (isStrict) \{\par
                return this._monthsStrictRegex;\par
            \} else \{\par
                return this._monthsRegex;\par
            \}\par
        \} else \{\par
            if (!hasOwnProp(this, '_monthsRegex')) \{\par
                this._monthsRegex = defaultMonthsRegex;\par
            \}\par
            return this._monthsStrictRegex && isStrict\par
                ? this._monthsStrictRegex\par
                : this._monthsRegex;\par
        \}\par
    \}\par
\par
    function computeMonthsParse() \{\par
        function cmpLenRev(a, b) \{\par
            return b.length - a.length;\par
        \}\par
\par
        var shortPieces = [],\par
            longPieces = [],\par
            mixedPieces = [],\par
            i,\par
            mom,\par
            shortP,\par
            longP;\par
        for (i = 0; i < 12; i++) \{\par
            // make the regex if we don't have it already\par
            mom = createUTC([2000, i]);\par
            shortP = regexEscape(this.monthsShort(mom, ''));\par
            longP = regexEscape(this.months(mom, ''));\par
            shortPieces.push(shortP);\par
            longPieces.push(longP);\par
            mixedPieces.push(longP);\par
            mixedPieces.push(shortP);\par
        \}\par
        // Sorting makes sure if one month (or abbr) is a prefix of another it\par
        // will match the longer piece.\par
        shortPieces.sort(cmpLenRev);\par
        longPieces.sort(cmpLenRev);\par
        mixedPieces.sort(cmpLenRev);\par
\par
        this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');\par
        this._monthsShortRegex = this._monthsRegex;\par
        this._monthsStrictRegex = new RegExp(\par
            '^(' + longPieces.join('|') + ')',\par
            'i'\par
        );\par
        this._monthsShortStrictRegex = new RegExp(\par
            '^(' + shortPieces.join('|') + ')',\par
            'i'\par
        );\par
    \}\par
\par
    function createDate(y, m, d, h, M, s, ms) \{\par
        // can't just apply() to create a date:\par
        // {{\field{\*\fldinst{HYPERLINK https://stackoverflow.com/q/181348 }}{\fldrslt{https://stackoverflow.com/q/181348\ul0\cf0}}}}\f0\fs22\par
        var date;\par
        // the date constructor remaps years 0-99 to 1900-1999\par
        if (y < 100 && y >= 0) \{\par
            // preserve leap years using a full 400 year cycle, then reset\par
            date = new Date(y + 400, m, d, h, M, s, ms);\par
            if (isFinite(date.getFullYear())) \{\par
                date.setFullYear(y);\par
            \}\par
        \} else \{\par
            date = new Date(y, m, d, h, M, s, ms);\par
        \}\par
\par
        return date;\par
    \}\par
\par
    function createUTCDate(y) \{\par
        var date, args;\par
        // the Date.UTC function remaps years 0-99 to 1900-1999\par
        if (y < 100 && y >= 0) \{\par
            args = Array.prototype.slice.call(arguments);\par
            // preserve leap years using a full 400 year cycle, then reset\par
            args[0] = y + 400;\par
            date = new Date(Date.UTC.apply(null, args));\par
            if (isFinite(date.getUTCFullYear())) \{\par
                date.setUTCFullYear(y);\par
            \}\par
        \} else \{\par
            date = new Date(Date.UTC.apply(null, arguments));\par
        \}\par
\par
        return date;\par
    \}\par
\par
    // start-of-first-week - start-of-year\par
    function firstWeekOffset(year, dow, doy) \{\par
        var // first-week day -- which january is always in the first week (4 for iso, 1 for other)\par
            fwd = 7 + dow - doy,\par
            // first-week day local weekday -- which local weekday is fwd\par
            fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;\par
\par
        return -fwdlw + fwd - 1;\par
    \}\par
\par
    // {{\field{\*\fldinst{HYPERLINK https://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday }}{\fldrslt{https://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday\ul0\cf0}}}}\f0\fs22\par
    function dayOfYearFromWeeks(year, week, weekday, dow, doy) \{\par
        var localWeekday = (7 + weekday - dow) % 7,\par
            weekOffset = firstWeekOffset(year, dow, doy),\par
            dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,\par
            resYear,\par
            resDayOfYear;\par
\par
        if (dayOfYear <= 0) \{\par
            resYear = year - 1;\par
            resDayOfYear = daysInYear(resYear) + dayOfYear;\par
        \} else if (dayOfYear > daysInYear(year)) \{\par
            resYear = year + 1;\par
            resDayOfYear = dayOfYear - daysInYear(year);\par
        \} else \{\par
            resYear = year;\par
            resDayOfYear = dayOfYear;\par
        \}\par
\par
        return \{\par
            year: resYear,\par
            dayOfYear: resDayOfYear,\par
        \};\par
    \}\par
\par
    function weekOfYear(mom, dow, doy) \{\par
        var weekOffset = firstWeekOffset(mom.year(), dow, doy),\par
            week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,\par
            resWeek,\par
            resYear;\par
\par
        if (week < 1) \{\par
            resYear = mom.year() - 1;\par
            resWeek = week + weeksInYear(resYear, dow, doy);\par
        \} else if (week > weeksInYear(mom.year(), dow, doy)) \{\par
            resWeek = week - weeksInYear(mom.year(), dow, doy);\par
            resYear = mom.year() + 1;\par
        \} else \{\par
            resYear = mom.year();\par
            resWeek = week;\par
        \}\par
\par
        return \{\par
            week: resWeek,\par
            year: resYear,\par
        \};\par
    \}\par
\par
    function weeksInYear(year, dow, doy) \{\par
        var weekOffset = firstWeekOffset(year, dow, doy),\par
            weekOffsetNext = firstWeekOffset(year + 1, dow, doy);\par
        return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;\par
    \}\par
\par
    // FORMATTING\par
\par
    addFormatToken('w', ['ww', 2], 'wo', 'week');\par
    addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');\par
\par
    // PARSING\par
\par
    addRegexToken('w', match1to2, match1to2NoLeadingZero);\par
    addRegexToken('ww', match1to2, match2);\par
    addRegexToken('W', match1to2, match1to2NoLeadingZero);\par
    addRegexToken('WW', match1to2, match2);\par
\par
    addWeekParseToken(\par
        ['w', 'ww', 'W', 'WW'],\par
        function (input, week, config, token) \{\par
            week[token.substr(0, 1)] = toInt(input);\par
        \}\par
    );\par
\par
    // HELPERS\par
\par
    // LOCALES\par
\par
    function localeWeek(mom) \{\par
        return weekOfYear(mom, this._week.dow, this._week.doy).week;\par
    \}\par
\par
    var defaultLocaleWeek = \{\par
        dow: 0, // Sunday is the first day of the week.\par
        doy: 6, // The week that contains Jan 6th is the first week of the year.\par
    \};\par
\par
    function localeFirstDayOfWeek() \{\par
        return this._week.dow;\par
    \}\par
\par
    function localeFirstDayOfYear() \{\par
        return this._week.doy;\par
    \}\par
\par
    // MOMENTS\par
\par
    function getSetWeek(input) \{\par
        var week = this.localeData().week(this);\par
        return input == null ? week : this.add((input - week) * 7, 'd');\par
    \}\par
\par
    function getSetISOWeek(input) \{\par
        var week = weekOfYear(this, 1, 4).week;\par
        return input == null ? week : this.add((input - week) * 7, 'd');\par
    \}\par
\par
    // FORMATTING\par
\par
    addFormatToken('d', 0, 'do', 'day');\par
\par
    addFormatToken('dd', 0, 0, function (format) \{\par
        return this.localeData().weekdaysMin(this, format);\par
    \});\par
\par
    addFormatToken('ddd', 0, 0, function (format) \{\par
        return this.localeData().weekdaysShort(this, format);\par
    \});\par
\par
    addFormatToken('dddd', 0, 0, function (format) \{\par
        return this.localeData().weekdays(this, format);\par
    \});\par
\par
    addFormatToken('e', 0, 0, 'weekday');\par
    addFormatToken('E', 0, 0, 'isoWeekday');\par
\par
    // PARSING\par
\par
    addRegexToken('d', match1to2);\par
    addRegexToken('e', match1to2);\par
    addRegexToken('E', match1to2);\par
    addRegexToken('dd', function (isStrict, locale) \{\par
        return locale.weekdaysMinRegex(isStrict);\par
    \});\par
    addRegexToken('ddd', function (isStrict, locale) \{\par
        return locale.weekdaysShortRegex(isStrict);\par
    \});\par
    addRegexToken('dddd', function (isStrict, locale) \{\par
        return locale.weekdaysRegex(isStrict);\par
    \});\par
\par
    addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) \{\par
        var weekday = config._locale.weekdaysParse(input, token, config._strict);\par
        // if we didn't get a weekday name, mark the date as invalid\par
        if (weekday != null) \{\par
            week.d = weekday;\par
        \} else \{\par
            getParsingFlags(config).invalidWeekday = input;\par
        \}\par
    \});\par
\par
    addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) \{\par
        week[token] = toInt(input);\par
    \});\par
\par
    // HELPERS\par
\par
    function parseWeekday(input, locale) \{\par
        if (typeof input !== 'string') \{\par
            return input;\par
        \}\par
\par
        if (!isNaN(input)) \{\par
            return parseInt(input, 10);\par
        \}\par
\par
        input = locale.weekdaysParse(input);\par
        if (typeof input === 'number') \{\par
            return input;\par
        \}\par
\par
        return null;\par
    \}\par
\par
    function parseIsoWeekday(input, locale) \{\par
        if (typeof input === 'string') \{\par
            return locale.weekdaysParse(input) % 7 || 7;\par
        \}\par
        return isNaN(input) ? null : input;\par
    \}\par
\par
    // LOCALES\par
    function shiftWeekdays(ws, n) \{\par
        return ws.slice(n, 7).concat(ws.slice(0, n));\par
    \}\par
\par
    var defaultLocaleWeekdays =\par
            'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),\par
        defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),\par
        defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),\par
        defaultWeekdaysRegex = matchWord,\par
        defaultWeekdaysShortRegex = matchWord,\par
        defaultWeekdaysMinRegex = matchWord;\par
\par
    function localeWeekdays(m, format) \{\par
        var weekdays = isArray(this._weekdays)\par
            ? this._weekdays\par
            : this._weekdays[\par
                  m && m !== true && this._weekdays.isFormat.test(format)\par
                      ? 'format'\par
                      : 'standalone'\par
              ];\par
        return m === true\par
            ? shiftWeekdays(weekdays, this._week.dow)\par
            : m\par
              ? weekdays[m.day()]\par
              : weekdays;\par
    \}\par
\par
    function localeWeekdaysShort(m) \{\par
        return m === true\par
            ? shiftWeekdays(this._weekdaysShort, this._week.dow)\par
            : m\par
              ? this._weekdaysShort[m.day()]\par
              : this._weekdaysShort;\par
    \}\par
\par
    function localeWeekdaysMin(m) \{\par
        return m === true\par
            ? shiftWeekdays(this._weekdaysMin, this._week.dow)\par
            : m\par
              ? this._weekdaysMin[m.day()]\par
              : this._weekdaysMin;\par
    \}\par
\par
    function handleStrictParse$1(weekdayName, format, strict) \{\par
        var i,\par
            ii,\par
            mom,\par
            llc = weekdayName.toLocaleLowerCase();\par
        if (!this._weekdaysParse) \{\par
            this._weekdaysParse = [];\par
            this._shortWeekdaysParse = [];\par
            this._minWeekdaysParse = [];\par
\par
            for (i = 0; i < 7; ++i) \{\par
                mom = createUTC([2000, 1]).day(i);\par
                this._minWeekdaysParse[i] = this.weekdaysMin(\par
                    mom,\par
                    ''\par
                ).toLocaleLowerCase();\par
                this._shortWeekdaysParse[i] = this.weekdaysShort(\par
                    mom,\par
                    ''\par
                ).toLocaleLowerCase();\par
                this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();\par
            \}\par
        \}\par
\par
        if (strict) \{\par
            if (format === 'dddd') \{\par
                ii = indexOf.call(this._weekdaysParse, llc);\par
                return ii !== -1 ? ii : null;\par
            \} else if (format === 'ddd') \{\par
                ii = indexOf.call(this._shortWeekdaysParse, llc);\par
                return ii !== -1 ? ii : null;\par
            \} else \{\par
                ii = indexOf.call(this._minWeekdaysParse, llc);\par
                return ii !== -1 ? ii : null;\par
            \}\par
        \} else \{\par
            if (format === 'dddd') \{\par
                ii = indexOf.call(this._weekdaysParse, llc);\par
                if (ii !== -1) \{\par
                    return ii;\par
                \}\par
                ii = indexOf.call(this._shortWeekdaysParse, llc);\par
                if (ii !== -1) \{\par
                    return ii;\par
                \}\par
                ii = indexOf.call(this._minWeekdaysParse, llc);\par
                return ii !== -1 ? ii : null;\par
            \} else if (format === 'ddd') \{\par
                ii = indexOf.call(this._shortWeekdaysParse, llc);\par
                if (ii !== -1) \{\par
                    return ii;\par
                \}\par
                ii = indexOf.call(this._weekdaysParse, llc);\par
                if (ii !== -1) \{\par
                    return ii;\par
                \}\par
                ii = indexOf.call(this._minWeekdaysParse, llc);\par
                return ii !== -1 ? ii : null;\par
            \} else \{\par
                ii = indexOf.call(this._minWeekdaysParse, llc);\par
                if (ii !== -1) \{\par
                    return ii;\par
                \}\par
                ii = indexOf.call(this._weekdaysParse, llc);\par
                if (ii !== -1) \{\par
                    return ii;\par
                \}\par
                ii = indexOf.call(this._shortWeekdaysParse, llc);\par
                return ii !== -1 ? ii : null;\par
            \}\par
        \}\par
    \}\par
\par
    function localeWeekdaysParse(weekdayName, format, strict) \{\par
        var i, mom, regex;\par
\par
        if (this._weekdaysParseExact) \{\par
            return handleStrictParse$1.call(this, weekdayName, format, strict);\par
        \}\par
\par
        if (!this._weekdaysParse) \{\par
            this._weekdaysParse = [];\par
            this._minWeekdaysParse = [];\par
            this._shortWeekdaysParse = [];\par
            this._fullWeekdaysParse = [];\par
        \}\par
\par
        for (i = 0; i < 7; i++) \{\par
            // make the regex if we don't have it already\par
\par
            mom = createUTC([2000, 1]).day(i);\par
            if (strict && !this._fullWeekdaysParse[i]) \{\par
                this._fullWeekdaysParse[i] = new RegExp(\par
                    '^' + this.weekdays(mom, '').replace('.', '{{\field{\*\fldinst{HYPERLINK "\\\\\\\\.?"}}{\fldrslt{\\\\.?\ul0\cf0}}}}\f0\fs22 ') + '$',\par
                    'i'\par
                );\par
                this._shortWeekdaysParse[i] = new RegExp(\par
                    '^' + this.weekdaysShort(mom, '').replace('.', '{{\field{\*\fldinst{HYPERLINK "\\\\\\\\.?"}}{\fldrslt{\\\\.?\ul0\cf0}}}}\f0\fs22 ') + '$',\par
                    'i'\par
                );\par
                this._minWeekdaysParse[i] = new RegExp(\par
                    '^' + this.weekdaysMin(mom, '').replace('.', '{{\field{\*\fldinst{HYPERLINK "\\\\\\\\.?"}}{\fldrslt{\\\\.?\ul0\cf0}}}}\f0\fs22 ') + '$',\par
                    'i'\par
                );\par
            \}\par
            if (!this._weekdaysParse[i]) \{\par
                regex =\par
                    '^' +\par
                    this.weekdays(mom, '') +\par
                    '|^' +\par
                    this.weekdaysShort(mom, '') +\par
                    '|^' +\par
                    this.weekdaysMin(mom, '');\par
                this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');\par
            \}\par
            // test the regex\par
            if (\par
                strict &&\par
                format === 'dddd' &&\par
                this._fullWeekdaysParse[i].test(weekdayName)\par
            ) \{\par
                return i;\par
            \} else if (\par
                strict &&\par
                format === 'ddd' &&\par
                this._shortWeekdaysParse[i].test(weekdayName)\par
            ) \{\par
                return i;\par
            \} else if (\par
                strict &&\par
                format === 'dd' &&\par
                this._minWeekdaysParse[i].test(weekdayName)\par
            ) \{\par
                return i;\par
            \} else if (!strict && this._weekdaysParse[i].test(weekdayName)) \{\par
                return i;\par
            \}\par
        \}\par
    \}\par
\par
    // MOMENTS\par
\par
    function getSetDayOfWeek(input) \{\par
        if (!this.isValid()) \{\par
            return input != null ? this : NaN;\par
        \}\par
\par
        var day = get(this, 'Day');\par
        if (input != null) \{\par
            input = parseWeekday(input, this.localeData());\par
            return this.add(input - day, 'd');\par
        \} else \{\par
            return day;\par
        \}\par
    \}\par
\par
    function getSetLocaleDayOfWeek(input) \{\par
        if (!this.isValid()) \{\par
            return input != null ? this : NaN;\par
        \}\par
        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;\par
        return input == null ? weekday : this.add(input - weekday, 'd');\par
    \}\par
\par
    function getSetISODayOfWeek(input) \{\par
        if (!this.isValid()) \{\par
            return input != null ? this : NaN;\par
        \}\par
\par
        // behaves the same as moment#day except\par
        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)\par
        // as a setter, sunday should belong to the previous week.\par
\par
        if (input != null) \{\par
            var weekday = parseIsoWeekday(input, this.localeData());\par
            return this.day(this.day() % 7 ? weekday : weekday - 7);\par
        \} else \{\par
            return this.day() || 7;\par
        \}\par
    \}\par
\par
    function weekdaysRegex(isStrict) \{\par
        if (this._weekdaysParseExact) \{\par
            if (!hasOwnProp(this, '_weekdaysRegex')) \{\par
                computeWeekdaysParse.call(this);\par
            \}\par
            if (isStrict) \{\par
                return this._weekdaysStrictRegex;\par
            \} else \{\par
                return this._weekdaysRegex;\par
            \}\par
        \} else \{\par
            if (!hasOwnProp(this, '_weekdaysRegex')) \{\par
                this._weekdaysRegex = defaultWeekdaysRegex;\par
            \}\par
            return this._weekdaysStrictRegex && isStrict\par
                ? this._weekdaysStrictRegex\par
                : this._weekdaysRegex;\par
        \}\par
    \}\par
\par
    function weekdaysShortRegex(isStrict) \{\par
        if (this._weekdaysParseExact) \{\par
            if (!hasOwnProp(this, '_weekdaysRegex')) \{\par
                computeWeekdaysParse.call(this);\par
            \}\par
            if (isStrict) \{\par
                return this._weekdaysShortStrictRegex;\par
            \} else \{\par
                return this._weekdaysShortRegex;\par
            \}\par
        \} else \{\par
            if (!hasOwnProp(this, '_weekdaysShortRegex')) \{\par
                this._weekdaysShortRegex = defaultWeekdaysShortRegex;\par
            \}\par
            return this._weekdaysShortStrictRegex && isStrict\par
                ? this._weekdaysShortStrictRegex\par
                : this._weekdaysShortRegex;\par
        \}\par
    \}\par
\par
    function weekdaysMinRegex(isStrict) \{\par
        if (this._weekdaysParseExact) \{\par
            if (!hasOwnProp(this, '_weekdaysRegex')) \{\par
                computeWeekdaysParse.call(this);\par
            \}\par
            if (isStrict) \{\par
                return this._weekdaysMinStrictRegex;\par
            \} else \{\par
                return this._weekdaysMinRegex;\par
            \}\par
        \} else \{\par
            if (!hasOwnProp(this, '_weekdaysMinRegex')) \{\par
                this._weekdaysMinRegex = defaultWeekdaysMinRegex;\par
            \}\par
            return this._weekdaysMinStrictRegex && isStrict\par
                ? this._weekdaysMinStrictRegex\par
                : this._weekdaysMinRegex;\par
        \}\par
    \}\par
\par
    function computeWeekdaysParse() \{\par
        function cmpLenRev(a, b) \{\par
            return b.length - a.length;\par
        \}\par
\par
        var minPieces = [],\par
            shortPieces = [],\par
            longPieces = [],\par
            mixedPieces = [],\par
            i,\par
            mom,\par
            minp,\par
            shortp,\par
            longp;\par
        for (i = 0; i < 7; i++) \{\par
            // make the regex if we don't have it already\par
            mom = createUTC([2000, 1]).day(i);\par
            minp = regexEscape(this.weekdaysMin(mom, ''));\par
            shortp = regexEscape(this.weekdaysShort(mom, ''));\par
            longp = regexEscape(this.weekdays(mom, ''));\par
            minPieces.push(minp);\par
            shortPieces.push(shortp);\par
            longPieces.push(longp);\par
            mixedPieces.push(minp);\par
            mixedPieces.push(shortp);\par
            mixedPieces.push(longp);\par
        \}\par
        // Sorting makes sure if one weekday (or abbr) is a prefix of another it\par
        // will match the longer piece.\par
        minPieces.sort(cmpLenRev);\par
        shortPieces.sort(cmpLenRev);\par
        longPieces.sort(cmpLenRev);\par
        mixedPieces.sort(cmpLenRev);\par
\par
        this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');\par
        this._weekdaysShortRegex = this._weekdaysRegex;\par
        this._weekdaysMinRegex = this._weekdaysRegex;\par
\par
        this._weekdaysStrictRegex = new RegExp(\par
            '^(' + longPieces.join('|') + ')',\par
            'i'\par
        );\par
        this._weekdaysShortStrictRegex = new RegExp(\par
            '^(' + shortPieces.join('|') + ')',\par
            'i'\par
        );\par
        this._weekdaysMinStrictRegex = new RegExp(\par
            '^(' + minPieces.join('|') + ')',\par
            'i'\par
        );\par
    \}\par
\par
    // FORMATTING\par
\par
    function hFormat() \{\par
        return this.hours() % 12 || 12;\par
    \}\par
\par
    function kFormat() \{\par
        return this.hours() || 24;\par
    \}\par
\par
    addFormatToken('H', ['HH', 2], 0, 'hour');\par
    addFormatToken('h', ['hh', 2], 0, hFormat);\par
    addFormatToken('k', ['kk', 2], 0, kFormat);\par
\par
    addFormatToken('hmm', 0, 0, function () \{\par
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);\par
    \});\par
\par
    addFormatToken('hmmss', 0, 0, function () \{\par
        return (\par
            '' +\par
            hFormat.apply(this) +\par
            zeroFill(this.minutes(), 2) +\par
            zeroFill(this.seconds(), 2)\par
        );\par
    \});\par
\par
    addFormatToken('Hmm', 0, 0, function () \{\par
        return '' + this.hours() + zeroFill(this.minutes(), 2);\par
    \});\par
\par
    addFormatToken('Hmmss', 0, 0, function () \{\par
        return (\par
            '' +\par
            this.hours() +\par
            zeroFill(this.minutes(), 2) +\par
            zeroFill(this.seconds(), 2)\par
        );\par
    \});\par
\par
    function meridiem(token, lowercase) \{\par
        addFormatToken(token, 0, 0, function () \{\par
            return this.localeData().meridiem(\par
                this.hours(),\par
                this.minutes(),\par
                lowercase\par
            );\par
        \});\par
    \}\par
\par
    meridiem('a', true);\par
    meridiem('A', false);\par
\par
    // PARSING\par
\par
    function matchMeridiem(isStrict, locale) \{\par
        return locale._meridiemParse;\par
    \}\par
\par
    addRegexToken('a', matchMeridiem);\par
    addRegexToken('A', matchMeridiem);\par
    addRegexToken('H', match1to2, match1to2HasZero);\par
    addRegexToken('h', match1to2, match1to2NoLeadingZero);\par
    addRegexToken('k', match1to2, match1to2NoLeadingZero);\par
    addRegexToken('HH', match1to2, match2);\par
    addRegexToken('hh', match1to2, match2);\par
    addRegexToken('kk', match1to2, match2);\par
\par
    addRegexToken('hmm', match3to4);\par
    addRegexToken('hmmss', match5to6);\par
    addRegexToken('Hmm', match3to4);\par
    addRegexToken('Hmmss', match5to6);\par
\par
    addParseToken(['H', 'HH'], HOUR);\par
    addParseToken(['k', 'kk'], function (input, array, config) \{\par
        var kInput = toInt(input);\par
        array[HOUR] = kInput === 24 ? 0 : kInput;\par
    \});\par
    addParseToken(['a', 'A'], function (input, array, config) \{\par
        config._isPm = config._locale.isPM(input);\par
        config._meridiem = input;\par
    \});\par
    addParseToken(['h', 'hh'], function (input, array, config) \{\par
        array[HOUR] = toInt(input);\par
        getParsingFlags(config).bigHour = true;\par
    \});\par
    addParseToken('hmm', function (input, array, config) \{\par
        var pos = input.length - 2;\par
        array[HOUR] = toInt(input.substr(0, pos));\par
        array[MINUTE] = toInt(input.substr(pos));\par
        getParsingFlags(config).bigHour = true;\par
    \});\par
    addParseToken('hmmss', function (input, array, config) \{\par
        var pos1 = input.length - 4,\par
            pos2 = input.length - 2;\par
        array[HOUR] = toInt(input.substr(0, pos1));\par
        array[MINUTE] = toInt(input.substr(pos1, 2));\par
        array[SECOND] = toInt(input.substr(pos2));\par
        getParsingFlags(config).bigHour = true;\par
    \});\par
    addParseToken('Hmm', function (input, array, config) \{\par
        var pos = input.length - 2;\par
        array[HOUR] = toInt(input.substr(0, pos));\par
        array[MINUTE] = toInt(input.substr(pos));\par
    \});\par
    addParseToken('Hmmss', function (input, array, config) \{\par
        var pos1 = input.length - 4,\par
            pos2 = input.length - 2;\par
        array[HOUR] = toInt(input.substr(0, pos1));\par
        array[MINUTE] = toInt(input.substr(pos1, 2));\par
        array[SECOND] = toInt(input.substr(pos2));\par
    \});\par
\par
    // LOCALES\par
\par
    function localeIsPM(input) \{\par
        // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays\par
        // Using charAt should be more compatible.\par
        return (input + '').toLowerCase().charAt(0) === 'p';\par
    \}\par
\par
    var defaultLocaleMeridiemParse = /[ap]\\.?m?\\.?/i,\par
        // Setting the hour should keep the time, because the user explicitly\par
        // specified which hour they want. So trying to maintain the same hour (in\par
        // a new timezone) makes sense. Adding/subtracting hours does not follow\par
        // this rule.\par
        getSetHour = makeGetSet('Hours', true);\par
\par
    function localeMeridiem(hours, minutes, isLower) \{\par
        if (hours > 11) \{\par
            return isLower ? 'pm' : 'PM';\par
        \} else \{\par
            return isLower ? 'am' : 'AM';\par
        \}\par
    \}\par
\par
    var baseConfig = \{\par
        calendar: defaultCalendar,\par
        longDateFormat: defaultLongDateFormat,\par
        invalidDate: defaultInvalidDate,\par
        ordinal: defaultOrdinal,\par
        dayOfMonthOrdinalParse: defaultDayOfMonthOrdinalParse,\par
        relativeTime: defaultRelativeTime,\par
\par
        months: defaultLocaleMonths,\par
        monthsShort: defaultLocaleMonthsShort,\par
\par
        week: defaultLocaleWeek,\par
\par
        weekdays: defaultLocaleWeekdays,\par
        weekdaysMin: defaultLocaleWeekdaysMin,\par
        weekdaysShort: defaultLocaleWeekdaysShort,\par
\par
        meridiemParse: defaultLocaleMeridiemParse,\par
    \};\par
\par
    // internal storage for locale config files\par
    var locales = \{\},\par
        localeFamilies = \{\},\par
        globalLocale;\par
\par
    function commonPrefix(arr1, arr2) \{\par
        var i,\par
            minl = Math.min(arr1.length, arr2.length);\par
        for (i = 0; i < minl; i += 1) \{\par
            if (arr1[i] !== arr2[i]) \{\par
                return i;\par
            \}\par
        \}\par
        return minl;\par
    \}\par
\par
    function normalizeLocale(key) \{\par
        return key ? key.toLowerCase().replace('_', '-') : key;\par
    \}\par
\par
    // pick the locale from the array\par
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each\par
    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root\par
    function chooseLocale(names) \{\par
        var i = 0,\par
            j,\par
            next,\par
            locale,\par
            split;\par
\par
        while (i < names.length) \{\par
            split = normalizeLocale(names[i]).split('-');\par
            j = split.length;\par
            next = normalizeLocale(names[i + 1]);\par
            next = next ? next.split('-') : null;\par
            while (j > 0) \{\par
                locale = loadLocale(split.slice(0, j).join('-'));\par
                if (locale) \{\par
                    return locale;\par
                \}\par
                if (\par
                    next &&\par
                    next.length >= j &&\par
                    commonPrefix(split, next) >= j - 1\par
                ) \{\par
                    //the next array item is better than a shallower substring of this one\par
                    break;\par
                \}\par
                j--;\par
            \}\par
            i++;\par
        \}\par
        return globalLocale;\par
    \}\par
\par
    function isLocaleNameSane(name) \{\par
        // Prevent names that look like filesystem paths, i.e contain '/' or '\\'\par
        // Ensure name is available and function returns boolean\par
        return !!(name && name.match('^[^/\\\\\\\\]*$'));\par
    \}\par
\par
    function loadLocale(name) \{\par
        var oldLocale = null,\par
            aliasedRequire;\par
        // TODO: Find a better way to register and load all the locales in Node\par
        if (\par
            locales[name] === undefined &&\par
            typeof module !== 'undefined' &&\par
            module &&\par
            module.exports &&\par
            isLocaleNameSane(name)\par
        ) \{\par
            try \{\par
                oldLocale = globalLocale._abbr;\par
                aliasedRequire = require;\par
                aliasedRequire('./locale/' + name);\par
                getSetGlobalLocale(oldLocale);\par
            \} catch (e) \{\par
                // mark as not found to avoid repeating expensive file require call causing high CPU\par
                // when trying to find en-US, en_US, en-us for every format call\par
                locales[name] = null; // null means not found\par
            \}\par
        \}\par
        return locales[name];\par
    \}\par
\par
    // This function will load locale and then set the global locale.  If\par
    // no arguments are passed in, it will simply return the current global\par
    // locale key.\par
    function getSetGlobalLocale(key, values) \{\par
        var data;\par
        if (key) \{\par
            if (isUndefined(values)) \{\par
                data = getLocale(key);\par
            \} else \{\par
                data = defineLocale(key, values);\par
            \}\par
\par
            if (data) \{\par
                // moment.duration._locale = moment._locale = data;\par
                globalLocale = data;\par
            \} else \{\par
                if (typeof console !== 'undefined' && console.warn) \{\par
                    //warn user if arguments are passed but the locale could not be set\par
                    console.warn(\par
                        'Locale ' + key + ' not found. Did you forget to load it?'\par
                    );\par
                \}\par
            \}\par
        \}\par
\par
        return globalLocale._abbr;\par
    \}\par
\par
    function defineLocale(name, config) \{\par
        if (config !== null) \{\par
            var locale,\par
                parentConfig = baseConfig;\par
            config.abbr = name;\par
            if (locales[name] != null) \{\par
                deprecateSimple(\par
                    'defineLocaleOverride',\par
                    'use moment.updateLocale(localeName, config) to change ' +\par
                        'an existing locale. moment.defineLocale(localeName, ' +\par
                        'config) should only be used for creating a new locale ' +\par
                        'See {{\field{\*\fldinst{HYPERLINK http://momentjs.com/guides/#/warnings/define-locale/ }}{\fldrslt{http://momentjs.com/guides/#/warnings/define-locale/\ul0\cf0}}}}\f0\fs22  for more info.'\par
                );\par
                parentConfig = locales[name]._config;\par
            \} else if (config.parentLocale != null) \{\par
                if (locales[config.parentLocale] != null) \{\par
                    parentConfig = locales[config.parentLocale]._config;\par
                \} else \{\par
                    locale = loadLocale(config.parentLocale);\par
                    if (locale != null) \{\par
                        parentConfig = locale._config;\par
                    \} else \{\par
                        if (!localeFamilies[config.parentLocale]) \{\par
                            localeFamilies[config.parentLocale] = [];\par
                        \}\par
                        localeFamilies[config.parentLocale].push(\{\par
                            name: name,\par
                            config: config,\par
                        \});\par
                        return null;\par
                    \}\par
                \}\par
            \}\par
            locales[name] = new Locale(mergeConfigs(parentConfig, config));\par
\par
            if (localeFamilies[name]) \{\par
                localeFamilies[name].forEach(function (x) \{\par
                    defineLocale(x.name, x.config);\par
                \});\par
            \}\par
\par
            // backwards compat for now: also set the locale\par
            // make sure we set the locale AFTER all child locales have been\par
            // created, so we won't end up with the child locale set.\par
            getSetGlobalLocale(name);\par
\par
            return locales[name];\par
        \} else \{\par
            // useful for testing\par
            delete locales[name];\par
            return null;\par
        \}\par
    \}\par
\par
    function updateLocale(name, config) \{\par
        if (config != null) \{\par
            var locale,\par
                tmpLocale,\par
                parentConfig = baseConfig;\par
\par
            if (locales[name] != null && locales[name].parentLocale != null) \{\par
                // Update existing child locale in-place to avoid memory-leaks\par
                locales[name].set(mergeConfigs(locales[name]._config, config));\par
            \} else \{\par
                // MERGE\par
                tmpLocale = loadLocale(name);\par
                if (tmpLocale != null) \{\par
                    parentConfig = tmpLocale._config;\par
                \}\par
                config = mergeConfigs(parentConfig, config);\par
                if (tmpLocale == null) \{\par
                    // updateLocale is called for creating a new locale\par
                    // Set abbr so it will have a name (getters return\par
                    // undefined otherwise).\par
                    config.abbr = name;\par
                \}\par
                locale = new Locale(config);\par
                locale.parentLocale = locales[name];\par
                locales[name] = locale;\par
            \}\par
\par
            // backwards compat for now: also set the locale\par
            getSetGlobalLocale(name);\par
        \} else \{\par
            // pass null for config to unupdate, useful for tests\par
            if (locales[name] != null) \{\par
                if (locales[name].parentLocale != null) \{\par
                    locales[name] = locales[name].parentLocale;\par
                    if (name === getSetGlobalLocale()) \{\par
                        getSetGlobalLocale(name);\par
                    \}\par
                \} else if (locales[name] != null) \{\par
                    delete locales[name];\par
                \}\par
            \}\par
        \}\par
        return locales[name];\par
    \}\par
\par
    // returns locale data\par
    function getLocale(key) \{\par
        var locale;\par
\par
        if (key && key._locale && key._locale._abbr) \{\par
            key = key._locale._abbr;\par
        \}\par
\par
        if (!key) \{\par
            return globalLocale;\par
        \}\par
\par
        if (!isArray(key)) \{\par
            //short-circuit everything else\par
            locale = loadLocale(key);\par
            if (locale) \{\par
                return locale;\par
            \}\par
            key = [key];\par
        \}\par
\par
        return chooseLocale(key);\par
    \}\par
\par
    function listLocales() \{\par
        return keys(locales);\par
    \}\par
\par
    function checkOverflow(m) \{\par
        var overflow,\par
            a = m._a;\par
\par
        if (a && getParsingFlags(m).overflow === -2) \{\par
            overflow =\par
                a[MONTH] < 0 || a[MONTH] > 11\par
                    ? MONTH\par
                    : a[DATE] < 1 || a[DATE] > daysInMonth(a[YEAR], a[MONTH])\par
                      ? DATE\par
                      : a[HOUR] < 0 ||\par
                          a[HOUR] > 24 ||\par
                          (a[HOUR] === 24 &&\par
                              (a[MINUTE] !== 0 ||\par
                                  a[SECOND] !== 0 ||\par
                                  a[MILLISECOND] !== 0))\par
                        ? HOUR\par
                        : a[MINUTE] < 0 || a[MINUTE] > 59\par
                          ? MINUTE\par
                          : a[SECOND] < 0 || a[SECOND] > 59\par
                            ? SECOND\par
                            : a[MILLISECOND] < 0 || a[MILLISECOND] > 999\par
                              ? MILLISECOND\par
                              : -1;\par
\par
            if (\par
                getParsingFlags(m)._overflowDayOfYear &&\par
                (overflow < YEAR || overflow > DATE)\par
            ) \{\par
                overflow = DATE;\par
            \}\par
            if (getParsingFlags(m)._overflowWeeks && overflow === -1) \{\par
                overflow = WEEK;\par
            \}\par
            if (getParsingFlags(m)._overflowWeekday && overflow === -1) \{\par
                overflow = WEEKDAY;\par
            \}\par
\par
            getParsingFlags(m).overflow = overflow;\par
        \}\par
\par
        return m;\par
    \}\par
\par
    // iso 8601 regex\par
    // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)\par
    var extendedIsoRegex =\par
            /^\\s*((?:[+-]\\d\{6\}|\\d\{4\})-(?:\\d\\d-\\d\\d|W\\d\\d-\\d|W\\d\\d|\\d\\d\\d|\\d\\d))(?:(T| )(\\d\\d(?::\\d\\d(?::\\d\\d(?:[.,]\\d+)?)?)?)([+-]\\d\\d(?::?\\d\\d)?|\\s*Z)?)?$/,\par
        basicIsoRegex =\par
            /^\\s*((?:[+-]\\d\{6\}|\\d\{4\})(?:\\d\\d\\d\\d|W\\d\\d\\d|W\\d\\d|\\d\\d\\d|\\d\\d|))(?:(T| )(\\d\\d(?:\\d\\d(?:\\d\\d(?:[.,]\\d+)?)?)?)([+-]\\d\\d(?::?\\d\\d)?|\\s*Z)?)?$/,\par
        tzRegex = /Z|[+-]\\d\\d(?::?\\d\\d)?/,\par
        isoDates = [\par
            ['YYYYYY-MM-DD', /[+-]\\d\{6\}-\\d\\d-\\d\\d/],\par
            ['YYYY-MM-DD', /\\d\{4\}-\\d\\d-\\d\\d/],\par
            ['GGGG-[W]WW-E', /\\d\{4\}-W\\d\\d-\\d/],\par
            ['GGGG-[W]WW', /\\d\{4\}-W\\d\\d/, false],\par
            ['YYYY-DDD', /\\d\{4\}-\\d\{3\}/],\par
            ['YYYY-MM', /\\d\{4\}-\\d\\d/, false],\par
            ['YYYYYYMMDD', /[+-]\\d\{10\}/],\par
            ['YYYYMMDD', /\\d\{8\}/],\par
            ['GGGG[W]WWE', /\\d\{4\}W\\d\{3\}/],\par
            ['GGGG[W]WW', /\\d\{4\}W\\d\{2\}/, false],\par
            ['YYYYDDD', /\\d\{7\}/],\par
            ['YYYYMM', /\\d\{6\}/, false],\par
            ['YYYY', /\\d\{4\}/, false],\par
        ],\par
        // iso time formats and regexes\par
        isoTimes = [\par
            ['HH:mm:ss.SSSS', /\\d\\d:\\d\\d:\\d\\d\\.\\d+/],\par
            ['HH:mm:ss,SSSS', /\\d\\d:\\d\\d:\\d\\d,\\d+/],\par
            ['HH:mm:ss', /\\d\\d:\\d\\d:\\d\\d/],\par
            ['HH:mm', /\\d\\d:\\d\\d/],\par
            ['HHmmss.SSSS', /\\d\\d\\d\\d\\d\\d\\.\\d+/],\par
            ['HHmmss,SSSS', /\\d\\d\\d\\d\\d\\d,\\d+/],\par
            ['HHmmss', /\\d\\d\\d\\d\\d\\d/],\par
            ['HHmm', /\\d\\d\\d\\d/],\par
            ['HH', /\\d\\d/],\par
        ],\par
        aspNetJsonRegex = /^\\/?Date\\((-?\\d+)/i,\par
        // RFC 2822 regex: For details see {{\field{\*\fldinst{HYPERLINK https://tools.ietf.org/html/rfc2822#section-3.3 }}{\fldrslt{https://tools.ietf.org/html/rfc2822#section-3.3\ul0\cf0}}}}\f0\fs22\par
        rfc2822 =\par
            /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\\s)?(\\d\{1,2\})\\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\\s(\\d\{2,4\})\\s(\\d\\d):(\\d\\d)(?::(\\d\\d))?\\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\\d\{4\}))$/,\par
        obsOffsets = \{\par
            UT: 0,\par
            GMT: 0,\par
            EDT: -4 * 60,\par
            EST: -5 * 60,\par
            CDT: -5 * 60,\par
            CST: -6 * 60,\par
            MDT: -6 * 60,\par
            MST: -7 * 60,\par
            PDT: -7 * 60,\par
            PST: -8 * 60,\par
        \};\par
\par
    // date from iso format\par
    function configFromISO(config) \{\par
        var i,\par
            l,\par
            string = config._i,\par
            match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),\par
            allowTime,\par
            dateFormat,\par
            timeFormat,\par
            tzFormat,\par
            isoDatesLen = isoDates.length,\par
            isoTimesLen = isoTimes.length;\par
\par
        if (match) \{\par
            getParsingFlags(config).iso = true;\par
            for (i = 0, l = isoDatesLen; i < l; i++) \{\par
                if (isoDates[i][1].exec(match[1])) \{\par
                    dateFormat = isoDates[i][0];\par
                    allowTime = isoDates[i][2] !== false;\par
                    break;\par
                \}\par
            \}\par
            if (dateFormat == null) \{\par
                config._isValid = false;\par
                return;\par
            \}\par
            if (match[3]) \{\par
                for (i = 0, l = isoTimesLen; i < l; i++) \{\par
                    if (isoTimes[i][1].exec(match[3])) \{\par
                        // match[2] should be 'T' or space\par
                        timeFormat = (match[2] || ' ') + isoTimes[i][0];\par
                        break;\par
                    \}\par
                \}\par
                if (timeFormat == null) \{\par
                    config._isValid = false;\par
                    return;\par
                \}\par
            \}\par
            if (!allowTime && timeFormat != null) \{\par
                config._isValid = false;\par
                return;\par
            \}\par
            if (match[4]) \{\par
                if (tzRegex.exec(match[4])) \{\par
                    tzFormat = 'Z';\par
                \} else \{\par
                    config._isValid = false;\par
                    return;\par
                \}\par
            \}\par
            config._f = dateFormat + (timeFormat || '') + (tzFormat || '');\par
            configFromStringAndFormat(config);\par
        \} else \{\par
            config._isValid = false;\par
        \}\par
    \}\par
\par
    function extractFromRFC2822Strings(\par
        yearStr,\par
        monthStr,\par
        dayStr,\par
        hourStr,\par
        minuteStr,\par
        secondStr\par
    ) \{\par
        var result = [\par
            untruncateYear(yearStr),\par
            defaultLocaleMonthsShort.indexOf(monthStr),\par
            parseInt(dayStr, 10),\par
            parseInt(hourStr, 10),\par
            parseInt(minuteStr, 10),\par
        ];\par
\par
        if (secondStr) \{\par
            result.push(parseInt(secondStr, 10));\par
        \}\par
\par
        return result;\par
    \}\par
\par
    function untruncateYear(yearStr) \{\par
        var year = parseInt(yearStr, 10);\par
        if (year <= 49) \{\par
            return 2000 + year;\par
        \} else if (year <= 999) \{\par
            return 1900 + year;\par
        \}\par
        return year;\par
    \}\par
\par
    function preprocessRFC2822(s) \{\par
        // Remove comments and folding whitespace and replace multiple-spaces with a single space\par
        return s\par
            .replace(/\\([^()]*\\)|[\\n\\t]/g, ' ')\par
            .replace(/(\\s\\s+)/g, ' ')\par
            .replace(/^\\s\\s*/, '')\par
            .replace(/\\s\\s*$/, '');\par
    \}\par
\par
    function checkWeekday(weekdayStr, parsedInput, config) \{\par
        if (weekdayStr) \{\par
            // TODO: Replace the vanilla JS Date object with an independent day-of-week check.\par
            var weekdayProvided = defaultLocaleWeekdaysShort.indexOf(weekdayStr),\par
                weekdayActual = new Date(\par
                    parsedInput[0],\par
                    parsedInput[1],\par
                    parsedInput[2]\par
                ).getDay();\par
            if (weekdayProvided !== weekdayActual) \{\par
                getParsingFlags(config).weekdayMismatch = true;\par
                config._isValid = false;\par
                return false;\par
            \}\par
        \}\par
        return true;\par
    \}\par
\par
    function calculateOffset(obsOffset, militaryOffset, numOffset) \{\par
        if (obsOffset) \{\par
            return obsOffsets[obsOffset];\par
        \} else if (militaryOffset) \{\par
            // the only allowed military tz is Z\par
            return 0;\par
        \} else \{\par
            var hm = parseInt(numOffset, 10),\par
                m = hm % 100,\par
                h = (hm - m) / 100;\par
            return h * 60 + m;\par
        \}\par
    \}\par
\par
    // date and time from ref 2822 format\par
    function configFromRFC2822(config) \{\par
        var match = rfc2822.exec(preprocessRFC2822(config._i)),\par
            parsedArray;\par
        if (match) \{\par
            parsedArray = extractFromRFC2822Strings(\par
                match[4],\par
                match[3],\par
                match[2],\par
                match[5],\par
                match[6],\par
                match[7]\par
            );\par
            if (!checkWeekday(match[1], parsedArray, config)) \{\par
                return;\par
            \}\par
\par
            config._a = parsedArray;\par
            config._tzm = calculateOffset(match[8], match[9], match[10]);\par
\par
            config._d = createUTCDate.apply(null, config._a);\par
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);\par
\par
            getParsingFlags(config).rfc2822 = true;\par
        \} else \{\par
            config._isValid = false;\par
        \}\par
    \}\par
\par
    // date from 1) ASP.NET, 2) ISO, 3) RFC 2822 formats, or 4) optional fallback if parsing isn't strict\par
    function configFromString(config) \{\par
        var matched = aspNetJsonRegex.exec(config._i);\par
        if (matched !== null) \{\par
            config._d = new Date(+matched[1]);\par
            return;\par
        \}\par
\par
        configFromISO(config);\par
        if (config._isValid === false) \{\par
            delete config._isValid;\par
        \} else \{\par
            return;\par
        \}\par
\par
        configFromRFC2822(config);\par
        if (config._isValid === false) \{\par
            delete config._isValid;\par
        \} else \{\par
            return;\par
        \}\par
\par
        if (config._strict) \{\par
            config._isValid = false;\par
        \} else \{\par
            // Final attempt, use Input Fallback\par
            hooks.createFromInputFallback(config);\par
        \}\par
    \}\par
\par
    hooks.createFromInputFallback = deprecate(\par
        'value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), ' +\par
            'which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are ' +\par
            'discouraged. Please refer to {{\field{\*\fldinst{HYPERLINK http://momentjs.com/guides/#/warnings/js-date/ }}{\fldrslt{http://momentjs.com/guides/#/warnings/js-date/\ul0\cf0}}}}\f0\fs22  for more info.',\par
        function (config) \{\par
            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));\par
        \}\par
    );\par
\par
    // Pick the first defined of two or three arguments.\par
    function defaults(a, b, c) \{\par
        if (a != null) \{\par
            return a;\par
        \}\par
        if (b != null) \{\par
            return b;\par
        \}\par
        return c;\par
    \}\par
\par
    function currentDateArray(config) \{\par
        // hooks is actually the exported moment object\par
        var nowValue = new Date(hooks.now());\par
        if (config._useUTC) \{\par
            return [\par
                nowValue.getUTCFullYear(),\par
                nowValue.getUTCMonth(),\par
                nowValue.getUTCDate(),\par
            ];\par
        \}\par
        return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];\par
    \}\par
\par
    // convert an array to a date.\par
    // the array should mirror the parameters below\par
    // note: all values past the year are optional and will default to the lowest possible value.\par
    // [year, month, day , hour, minute, second, millisecond]\par
    function configFromArray(config) \{\par
        var i,\par
            date,\par
            input = [],\par
            currentDate,\par
            expectedWeekday,\par
            yearToUse;\par
\par
        if (config._d) \{\par
            return;\par
        \}\par
\par
        currentDate = currentDateArray(config);\par
\par
        //compute day of the year from weeks and weekdays\par
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) \{\par
            dayOfYearFromWeekInfo(config);\par
        \}\par
\par
        //if the day of the year is set, figure out what it is\par
        if (config._dayOfYear != null) \{\par
            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);\par
\par
            if (\par
                config._dayOfYear > daysInYear(yearToUse) ||\par
                config._dayOfYear === 0\par
            ) \{\par
                getParsingFlags(config)._overflowDayOfYear = true;\par
            \}\par
\par
            date = createUTCDate(yearToUse, 0, config._dayOfYear);\par
            config._a[MONTH] = date.getUTCMonth();\par
            config._a[DATE] = date.getUTCDate();\par
        \}\par
\par
        // Default to current date.\par
        // * if no year, month, day of month are given, default to today\par
        // * if day of month is given, default month and year\par
        // * if month is given, default only year\par
        // * if year is given, don't default anything\par
        for (i = 0; i < 3 && config._a[i] == null; ++i) \{\par
            config._a[i] = input[i] = currentDate[i];\par
        \}\par
\par
        // Zero out whatever was not defaulted, including time\par
        for (; i < 7; i++) \{\par
            config._a[i] = input[i] =\par
                config._a[i] == null ? (i === 2 ? 1 : 0) : config._a[i];\par
        \}\par
\par
        // Check for 24:00:00.000\par
        if (\par
            config._a[HOUR] === 24 &&\par
            config._a[MINUTE] === 0 &&\par
            config._a[SECOND] === 0 &&\par
            config._a[MILLISECOND] === 0\par
        ) \{\par
            config._nextDay = true;\par
            config._a[HOUR] = 0;\par
        \}\par
\par
        config._d = (config._useUTC ? createUTCDate : createDate).apply(\par
            null,\par
            input\par
        );\par
        expectedWeekday = config._useUTC\par
            ? config._d.getUTCDay()\par
            : config._d.getDay();\par
\par
        // Apply timezone offset from input. The actual utcOffset can be changed\par
        // with parseZone.\par
        if (config._tzm != null) \{\par
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);\par
        \}\par
\par
        if (config._nextDay) \{\par
            config._a[HOUR] = 24;\par
        \}\par
\par
        // check for mismatching day of week\par
        if (\par
            config._w &&\par
            typeof config._w.d !== 'undefined' &&\par
            config._w.d !== expectedWeekday\par
        ) \{\par
            getParsingFlags(config).weekdayMismatch = true;\par
        \}\par
    \}\par
\par
    function dayOfYearFromWeekInfo(config) \{\par
        var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow, curWeek;\par
\par
        w = config._w;\par
        if (w.GG != null || w.W != null || w.E != null) \{\par
            dow = 1;\par
            doy = 4;\par
\par
            // TODO: We need to take the current isoWeekYear, but that depends on\par
            // how we interpret now (local, utc, fixed offset). So create\par
            // a now version of current config (take local/utc/offset flags, and\par
            // create now).\par
            weekYear = defaults(\par
                w.GG,\par
                config._a[YEAR],\par
                weekOfYear(createLocal(), 1, 4).year\par
            );\par
            week = defaults(w.W, 1);\par
            weekday = defaults(w.E, 1);\par
            if (weekday < 1 || weekday > 7) \{\par
                weekdayOverflow = true;\par
            \}\par
        \} else \{\par
            dow = config._locale._week.dow;\par
            doy = config._locale._week.doy;\par
\par
            curWeek = weekOfYear(createLocal(), dow, doy);\par
\par
            weekYear = defaults(w.gg, config._a[YEAR], curWeek.year);\par
\par
            // Default to current week.\par
            week = defaults(w.w, curWeek.week);\par
\par
            if (w.d != null) \{\par
                // weekday -- low day numbers are considered next week\par
                weekday = w.d;\par
                if (weekday < 0 || weekday > 6) \{\par
                    weekdayOverflow = true;\par
                \}\par
            \} else if (w.e != null) \{\par
                // local weekday -- counting starts from beginning of week\par
                weekday = w.e + dow;\par
                if (w.e < 0 || w.e > 6) \{\par
                    weekdayOverflow = true;\par
                \}\par
            \} else \{\par
                // default to beginning of week\par
                weekday = dow;\par
            \}\par
        \}\par
        if (week < 1 || week > weeksInYear(weekYear, dow, doy)) \{\par
            getParsingFlags(config)._overflowWeeks = true;\par
        \} else if (weekdayOverflow != null) \{\par
            getParsingFlags(config)._overflowWeekday = true;\par
        \} else \{\par
            temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);\par
            config._a[YEAR] = temp.year;\par
            config._dayOfYear = temp.dayOfYear;\par
        \}\par
    \}\par
\par
    // constant that refers to the ISO standard\par
    hooks.ISO_8601 = function () \{\};\par
\par
    // constant that refers to the RFC 2822 form\par
    hooks.RFC_2822 = function () \{\};\par
\par
    // date from string and format string\par
    function configFromStringAndFormat(config) \{\par
        // TODO: Move this to another part of the creation flow to prevent circular deps\par
        if (config._f === hooks.ISO_8601) \{\par
            configFromISO(config);\par
            return;\par
        \}\par
        if (config._f === hooks.RFC_2822) \{\par
            configFromRFC2822(config);\par
            return;\par
        \}\par
        config._a = [];\par
        getParsingFlags(config).empty = true;\par
\par
        // This array is used to make a Date, either with `new Date` or `Date.UTC`\par
        var string = '' + config._i,\par
            i,\par
            parsedInput,\par
            tokens,\par
            token,\par
            skipped,\par
            stringLength = string.length,\par
            totalParsedInputLength = 0,\par
            era,\par
            tokenLen;\par
\par
        tokens =\par
            expandFormat(config._f, config._locale).match(formattingTokens) || [];\par
        tokenLen = tokens.length;\par
        for (i = 0; i < tokenLen; i++) \{\par
            token = tokens[i];\par
            parsedInput = (string.match(getParseRegexForToken(token, config)) ||\par
                [])[0];\par
            if (parsedInput) \{\par
                skipped = string.substr(0, string.indexOf(parsedInput));\par
                if (skipped.length > 0) \{\par
                    getParsingFlags(config).unusedInput.push(skipped);\par
                \}\par
                string = string.slice(\par
                    string.indexOf(parsedInput) + parsedInput.length\par
                );\par
                totalParsedInputLength += parsedInput.length;\par
            \}\par
            // don't parse if it's not a known token\par
            if (formatTokenFunctions[token]) \{\par
                if (parsedInput) \{\par
                    getParsingFlags(config).empty = false;\par
                \} else \{\par
                    getParsingFlags(config).unusedTokens.push(token);\par
                \}\par
                addTimeToArrayFromToken(token, parsedInput, config);\par
            \} else if (config._strict && !parsedInput) \{\par
                getParsingFlags(config).unusedTokens.push(token);\par
            \}\par
        \}\par
\par
        // add remaining unparsed input length to the string\par
        getParsingFlags(config).charsLeftOver =\par
            stringLength - totalParsedInputLength;\par
        if (string.length > 0) \{\par
            getParsingFlags(config).unusedInput.push(string);\par
        \}\par
\par
        // clear _12h flag if hour is <= 12\par
        if (\par
            config._a[HOUR] <= 12 &&\par
            getParsingFlags(config).bigHour === true &&\par
            config._a[HOUR] > 0\par
        ) \{\par
            getParsingFlags(config).bigHour = undefined;\par
        \}\par
\par
        getParsingFlags(config).parsedDateParts = config._a.slice(0);\par
        getParsingFlags(config).meridiem = config._meridiem;\par
        // handle meridiem\par
        config._a[HOUR] = meridiemFixWrap(\par
            config._locale,\par
            config._a[HOUR],\par
            config._meridiem\par
        );\par
\par
        // handle era\par
        era = getParsingFlags(config).era;\par
        if (era !== null) \{\par
            config._a[YEAR] = config._locale.erasConvertYear(era, config._a[YEAR]);\par
        \}\par
\par
        configFromArray(config);\par
        checkOverflow(config);\par
    \}\par
\par
    function meridiemFixWrap(locale, hour, meridiem) \{\par
        var isPm;\par
\par
        if (meridiem == null) \{\par
            // nothing to do\par
            return hour;\par
        \}\par
        if (locale.meridiemHour != null) \{\par
            return locale.meridiemHour(hour, meridiem);\par
        \} else if (locale.isPM != null) \{\par
            // Fallback\par
            isPm = locale.isPM(meridiem);\par
            if (isPm && hour < 12) \{\par
                hour += 12;\par
            \}\par
            if (!isPm && hour === 12) \{\par
                hour = 0;\par
            \}\par
            return hour;\par
        \} else \{\par
            // this is not supposed to happen\par
            return hour;\par
        \}\par
    \}\par
\par
    // date from string and array of format strings\par
    function configFromStringAndArray(config) \{\par
        var tempConfig,\par
            bestMoment,\par
            scoreToBeat,\par
            i,\par
            currentScore,\par
            validFormatFound,\par
            bestFormatIsValid = false,\par
            configfLen = config._f.length;\par
\par
        if (configfLen === 0) \{\par
            getParsingFlags(config).invalidFormat = true;\par
            config._d = new Date(NaN);\par
            return;\par
        \}\par
\par
        for (i = 0; i < configfLen; i++) \{\par
            currentScore = 0;\par
            validFormatFound = false;\par
            tempConfig = copyConfig(\{\}, config);\par
            if (config._useUTC != null) \{\par
                tempConfig._useUTC = config._useUTC;\par
            \}\par
            tempConfig._f = config._f[i];\par
            configFromStringAndFormat(tempConfig);\par
\par
            if (isValid(tempConfig)) \{\par
                validFormatFound = true;\par
            \}\par
\par
            // if there is any input that was not parsed add a penalty for that format\par
            currentScore += getParsingFlags(tempConfig).charsLeftOver;\par
\par
            //or tokens\par
            currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;\par
\par
            getParsingFlags(tempConfig).score = currentScore;\par
\par
            if (!bestFormatIsValid) \{\par
                if (\par
                    scoreToBeat == null ||\par
                    currentScore < scoreToBeat ||\par
                    validFormatFound\par
                ) \{\par
                    scoreToBeat = currentScore;\par
                    bestMoment = tempConfig;\par
                    if (validFormatFound) \{\par
                        bestFormatIsValid = true;\par
                    \}\par
                \}\par
            \} else \{\par
                if (currentScore < scoreToBeat) \{\par
                    scoreToBeat = currentScore;\par
                    bestMoment = tempConfig;\par
                \}\par
            \}\par
        \}\par
\par
        extend(config, bestMoment || tempConfig);\par
    \}\par
\par
    function configFromObject(config) \{\par
        if (config._d) \{\par
            return;\par
        \}\par
\par
        var i = normalizeObjectUnits(config._i),\par
            dayOrDate = i.day === undefined ? i.date : i.day;\par
        config._a = map(\par
            [i.year, i.month, dayOrDate, i.hour, i.minute, i.second, i.millisecond],\par
            function (obj) \{\par
                return obj && parseInt(obj, 10);\par
            \}\par
        );\par
\par
        configFromArray(config);\par
    \}\par
\par
    function createFromConfig(config) \{\par
        var res = new Moment(checkOverflow(prepareConfig(config)));\par
        if (res._nextDay) \{\par
            // Adding is smart enough around DST\par
            res.add(1, 'd');\par
            res._nextDay = undefined;\par
        \}\par
\par
        return res;\par
    \}\par
\par
    function prepareConfig(config) \{\par
        var input = config._i,\par
            format = config._f;\par
\par
        config._locale = config._locale || getLocale(config._l);\par
\par
        if (input === null || (format === undefined && input === '')) \{\par
            return createInvalid(\{ nullInput: true \});\par
        \}\par
\par
        if (typeof input === 'string') \{\par
            config._i = input = config._locale.preparse(input);\par
        \}\par
\par
        if (isMoment(input)) \{\par
            return new Moment(checkOverflow(input));\par
        \} else if (isDate(input)) \{\par
            config._d = input;\par
        \} else if (isArray(format)) \{\par
            configFromStringAndArray(config);\par
        \} else if (format) \{\par
            configFromStringAndFormat(config);\par
        \} else \{\par
            configFromInput(config);\par
        \}\par
\par
        if (!isValid(config)) \{\par
            config._d = null;\par
        \}\par
\par
        return config;\par
    \}\par
\par
    function configFromInput(config) \{\par
        var input = config._i;\par
        if (isUndefined(input)) \{\par
            config._d = new Date(hooks.now());\par
        \} else if (isDate(input)) \{\par
            config._d = new Date(input.valueOf());\par
        \} else if (typeof input === 'string') \{\par
            configFromString(config);\par
        \} else if (isArray(input)) \{\par
            config._a = map(input.slice(0), function (obj) \{\par
                return parseInt(obj, 10);\par
            \});\par
            configFromArray(config);\par
        \} else if (isObject(input)) \{\par
            configFromObject(config);\par
        \} else if (isNumber(input)) \{\par
            // from milliseconds\par
            config._d = new Date(input);\par
        \} else \{\par
            hooks.createFromInputFallback(config);\par
        \}\par
    \}\par
\par
    function createLocalOrUTC(input, format, locale, strict, isUTC) \{\par
        var c = \{\};\par
\par
        if (format === true || format === false) \{\par
            strict = format;\par
            format = undefined;\par
        \}\par
\par
        if (locale === true || locale === false) \{\par
            strict = locale;\par
            locale = undefined;\par
        \}\par
\par
        if (\par
            (isObject(input) && isObjectEmpty(input)) ||\par
            (isArray(input) && input.length === 0)\par
        ) \{\par
            input = undefined;\par
        \}\par
        // object construction must be done this way.\par
        // {{\field{\*\fldinst{HYPERLINK https://github.com/moment/moment/issues/1423 }}{\fldrslt{https://github.com/moment/moment/issues/1423\ul0\cf0}}}}\f0\fs22\par
        c._isAMomentObject = true;\par
        c._useUTC = c._isUTC = isUTC;\par
        c._l = locale;\par
        c._i = input;\par
        c._f = format;\par
        c._strict = strict;\par
\par
        return createFromConfig(c);\par
    \}\par
\par
    function createLocal(input, format, locale, strict) \{\par
        return createLocalOrUTC(input, format, locale, strict, false);\par
    \}\par
\par
    var prototypeMin = deprecate(\par
            'moment().min is deprecated, use moment.max instead. {{\field{\*\fldinst{HYPERLINK http://momentjs.com/guides/#/warnings/min-max/' }}{\fldrslt{http://momentjs.com/guides/#/warnings/min-max/'\ul0\cf0}}}}\f0\fs22 ,\par
            function () \{\par
                var other = createLocal.apply(null, arguments);\par
                if (this.isValid() && other.isValid()) \{\par
                    return other < this ? this : other;\par
                \} else \{\par
                    return createInvalid();\par
                \}\par
            \}\par
        ),\par
        prototypeMax = deprecate(\par
            'moment().max is deprecated, use moment.min instead. {{\field{\*\fldinst{HYPERLINK http://momentjs.com/guides/#/warnings/min-max/' }}{\fldrslt{http://momentjs.com/guides/#/warnings/min-max/'\ul0\cf0}}}}\f0\fs22 ,\par
            function () \{\par
                var other = createLocal.apply(null, arguments);\par
                if (this.isValid() && other.isValid()) \{\par
                    return other > this ? this : other;\par
                \} else \{\par
                    return createInvalid();\par
                \}\par
            \}\par
        );\par
\par
    // Pick a moment m from moments so that m[fn](other) is true for all\par
    // other. This relies on the function fn to be transitive.\par
    //\par
    // moments should either be an array of moment objects or an array, whose\par
    // first element is an array of moment objects.\par
    function pickBy(fn, moments) \{\par
        var res, i;\par
        if (moments.length === 1 && isArray(moments[0])) \{\par
            moments = moments[0];\par
        \}\par
        if (!moments.length) \{\par
            return createLocal();\par
        \}\par
        res = moments[0];\par
        for (i = 1; i < moments.length; ++i) \{\par
            if (!moments[i].isValid() || moments[i][fn](res)) \{\par
                res = moments[i];\par
            \}\par
        \}\par
        return res;\par
    \}\par
\par
    // TODO: Use [].sort instead?\par
    function min() \{\par
        var args = [].slice.call(arguments, 0);\par
\par
        return pickBy('isBefore', args);\par
    \}\par
\par
    function max() \{\par
        var args = [].slice.call(arguments, 0);\par
\par
        return pickBy('isAfter', args);\par
    \}\par
\par
    var now = function () \{\par
        return Date.now ? Date.now() : +new Date();\par
    \};\par
\par
    var ordering = [\par
        'year',\par
        'quarter',\par
        'month',\par
        'week',\par
        'day',\par
        'hour',\par
        'minute',\par
        'second',\par
        'millisecond',\par
    ];\par
\par
    function isDurationValid(m) \{\par
        var key,\par
            unitHasDecimal = false,\par
            i,\par
            orderLen = ordering.length;\par
        for (key in m) \{\par
            if (\par
                hasOwnProp(m, key) &&\par
                !(\par
                    indexOf.call(ordering, key) !== -1 &&\par
                    (m[key] == null || !isNaN(m[key]))\par
                )\par
            ) \{\par
                return false;\par
            \}\par
        \}\par
\par
        for (i = 0; i < orderLen; ++i) \{\par
            if (m[ordering[i]]) \{\par
                if (unitHasDecimal) \{\par
                    return false; // only allow non-integers for smallest unit\par
                \}\par
                if (parseFloat(m[ordering[i]]) !== toInt(m[ordering[i]])) \{\par
                    unitHasDecimal = true;\par
                \}\par
            \}\par
        \}\par
\par
        return true;\par
    \}\par
\par
    function isValid$1() \{\par
        return this._isValid;\par
    \}\par
\par
    function createInvalid$1() \{\par
        return createDuration(NaN);\par
    \}\par
\par
    function Duration(duration) \{\par
        var normalizedInput = normalizeObjectUnits(duration),\par
            years = normalizedInput.year || 0,\par
            quarters = normalizedInput.quarter || 0,\par
            months = normalizedInput.month || 0,\par
            weeks = normalizedInput.week || normalizedInput.isoWeek || 0,\par
            days = normalizedInput.day || 0,\par
            hours = normalizedInput.hour || 0,\par
            minutes = normalizedInput.minute || 0,\par
            seconds = normalizedInput.second || 0,\par
            milliseconds = normalizedInput.millisecond || 0;\par
\par
        this._isValid = isDurationValid(normalizedInput);\par
\par
        // representation for dateAddRemove\par
        this._milliseconds =\par
            +milliseconds +\par
            seconds * 1e3 + // 1000\par
            minutes * 6e4 + // 1000 * 60\par
            hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors {{\field{\*\fldinst{HYPERLINK https://github.com/moment/moment/issues/2978 }}{\fldrslt{https://github.com/moment/moment/issues/2978\ul0\cf0}}}}\f0\fs22\par
        // Because of dateAddRemove treats 24 hours as different from a\par
        // day when working around DST, we need to store them separately\par
        this._days = +days + weeks * 7;\par
        // It is impossible to translate months into days without knowing\par
        // which months you are are talking about, so we have to store\par
        // it separately.\par
        this._months = +months + quarters * 3 + years * 12;\par
\par
        this._data = \{\};\par
\par
        this._locale = getLocale();\par
\par
        this._bubble();\par
    \}\par
\par
    function isDuration(obj) \{\par
        return obj instanceof Duration;\par
    \}\par
\par
    function absRound(number) \{\par
        if (number < 0) \{\par
            return Math.round(-1 * number) * -1;\par
        \} else \{\par
            return Math.round(number);\par
        \}\par
    \}\par
\par
    // compare two arrays, return the number of differences\par
    function compareArrays(array1, array2, dontConvert) \{\par
        var len = Math.min(array1.length, array2.length),\par
            lengthDiff = Math.abs(array1.length - array2.length),\par
            diffs = 0,\par
            i;\par
        for (i = 0; i < len; i++) \{\par
            if (\par
                (dontConvert && array1[i] !== array2[i]) ||\par
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))\par
            ) \{\par
                diffs++;\par
            \}\par
        \}\par
        return diffs + lengthDiff;\par
    \}\par
\par
    // FORMATTING\par
\par
    function offset(token, separator) \{\par
        addFormatToken(token, 0, 0, function () \{\par
            var offset = this.utcOffset(),\par
                sign = '+';\par
            if (offset < 0) \{\par
                offset = -offset;\par
                sign = '-';\par
            \}\par
            return (\par
                sign +\par
                zeroFill(~~(offset / 60), 2) +\par
                separator +\par
                zeroFill(~~offset % 60, 2)\par
            );\par
        \});\par
    \}\par
\par
    offset('Z', ':');\par
    offset('ZZ', '');\par
\par
    // PARSING\par
\par
    addRegexToken('Z', matchShortOffset);\par
    addRegexToken('ZZ', matchShortOffset);\par
    addParseToken(['Z', 'ZZ'], function (input, array, config) \{\par
        config._useUTC = true;\par
        config._tzm = offsetFromString(matchShortOffset, input);\par
    \});\par
\par
    // HELPERS\par
\par
    // timezone chunker\par
    // '+10:00' > ['10',  '00']\par
    // '-1530'  > ['-15', '30']\par
    var chunkOffset = /([\\+\\-]|\\d\\d)/gi;\par
\par
    function offsetFromString(matcher, string) \{\par
        var matches = (string || '').match(matcher),\par
            chunk,\par
            parts,\par
            minutes;\par
\par
        if (matches === null) \{\par
            return null;\par
        \}\par
\par
        chunk = matches[matches.length - 1] || [];\par
        parts = (chunk + '').match(chunkOffset) || ['-', 0, 0];\par
        minutes = +(parts[1] * 60) + toInt(parts[2]);\par
\par
        return minutes === 0 ? 0 : parts[0] === '+' ? minutes : -minutes;\par
    \}\par
\par
    // Return a moment from input, that is local/utc/zone equivalent to model.\par
    function cloneWithOffset(input, model) \{\par
        var res, diff;\par
        if (model._isUTC) \{\par
            res = model.clone();\par
            diff =\par
                (isMoment(input) || isDate(input)\par
                    ? input.valueOf()\par
                    : createLocal(input).valueOf()) - res.valueOf();\par
            // Use low-level api, because this fn is low-level api.\par
            res._d.setTime(res._d.valueOf() + diff);\par
            hooks.updateOffset(res, false);\par
            return res;\par
        \} else \{\par
            return createLocal(input).local();\par
        \}\par
    \}\par
\par
    function getDateOffset(m) \{\par
        // On Firefox.24 Date#getTimezoneOffset returns a floating point.\par
        // {{\field{\*\fldinst{HYPERLINK https://github.com/moment/moment/pull/1871 }}{\fldrslt{https://github.com/moment/moment/pull/1871\ul0\cf0}}}}\f0\fs22\par
        return -Math.round(m._d.getTimezoneOffset());\par
    \}\par
\par
    // HOOKS\par
\par
    // This function will be called whenever a moment is mutated.\par
    // It is intended to keep the offset in sync with the timezone.\par
    hooks.updateOffset = function () \{\};\par
\par
    // MOMENTS\par
\par
    // keepLocalTime = true means only change the timezone, without\par
    // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->\par
    // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset\par
    // +0200, so we adjust the time as needed, to be valid.\par
    //\par
    // Keeping the time actually adds/subtracts (one hour)\par
    // from the actual represented time. That is why we call updateOffset\par
    // a second time. In case it wants us to change the offset again\par
    // _changeInProgress == true case, then we have to adjust, because\par
    // there is no such time in the given timezone.\par
    function getSetOffset(input, keepLocalTime, keepMinutes) \{\par
        var offset = this._offset || 0,\par
            localAdjust;\par
        if (!this.isValid()) \{\par
            return input != null ? this : NaN;\par
        \}\par
        if (input != null) \{\par
            if (typeof input === 'string') \{\par
                input = offsetFromString(matchShortOffset, input);\par
                if (input === null) \{\par
                    return this;\par
                \}\par
            \} else if (Math.abs(input) < 16 && !keepMinutes) \{\par
                input = input * 60;\par
            \}\par
            if (!this._isUTC && keepLocalTime) \{\par
                localAdjust = getDateOffset(this);\par
            \}\par
            this._offset = input;\par
            this._isUTC = true;\par
            if (localAdjust != null) \{\par
                this.add(localAdjust, 'm');\par
            \}\par
            if (offset !== input) \{\par
                if (!keepLocalTime || this._changeInProgress) \{\par
                    addSubtract(\par
                        this,\par
                        createDuration(input - offset, 'm'),\par
                        1,\par
                        false\par
                    );\par
                \} else if (!this._changeInProgress) \{\par
                    this._changeInProgress = true;\par
                    hooks.updateOffset(this, true);\par
                    this._changeInProgress = null;\par
                \}\par
            \}\par
            return this;\par
        \} else \{\par
            return this._isUTC ? offset : getDateOffset(this);\par
        \}\par
    \}\par
\par
    function getSetZone(input, keepLocalTime) \{\par
        if (input != null) \{\par
            if (typeof input !== 'string') \{\par
                input = -input;\par
            \}\par
\par
            this.utcOffset(input, keepLocalTime);\par
\par
            return this;\par
        \} else \{\par
            return -this.utcOffset();\par
        \}\par
    \}\par
\par
    function setOffsetToUTC(keepLocalTime) \{\par
        return this.utcOffset(0, keepLocalTime);\par
    \}\par
\par
    function setOffsetToLocal(keepLocalTime) \{\par
        if (this._isUTC) \{\par
            this.utcOffset(0, keepLocalTime);\par
            this._isUTC = false;\par
\par
            if (keepLocalTime) \{\par
                this.subtract(getDateOffset(this), 'm');\par
            \}\par
        \}\par
        return this;\par
    \}\par
\par
    function setOffsetToParsedOffset() \{\par
        if (this._tzm != null) \{\par
            this.utcOffset(this._tzm, false, true);\par
        \} else if (typeof this._i === 'string') \{\par
            var tZone = offsetFromString(matchOffset, this._i);\par
            if (tZone != null) \{\par
                this.utcOffset(tZone);\par
            \} else \{\par
                this.utcOffset(0, true);\par
            \}\par
        \}\par
        return this;\par
    \}\par
\par
    function hasAlignedHourOffset(input) \{\par
        if (!this.isValid()) \{\par
            return false;\par
        \}\par
        input = input ? createLocal(input).utcOffset() : 0;\par
\par
        return (this.utcOffset() - input) % 60 === 0;\par
    \}\par
\par
    function isDaylightSavingTime() \{\par
        return (\par
            this.utcOffset() > this.clone().month(0).utcOffset() ||\par
            this.utcOffset() > this.clone().month(5).utcOffset()\par
        );\par
    \}\par
\par
    function isDaylightSavingTimeShifted() \{\par
        if (!isUndefined(this._isDSTShifted)) \{\par
            return this._isDSTShifted;\par
        \}\par
\par
        var c = \{\},\par
            other;\par
\par
        copyConfig(c, this);\par
        c = prepareConfig(c);\par
\par
        if (c._a) \{\par
            other = c._isUTC ? createUTC(c._a) : createLocal(c._a);\par
            this._isDSTShifted =\par
                this.isValid() && compareArrays(c._a, other.toArray()) > 0;\par
        \} else \{\par
            this._isDSTShifted = false;\par
        \}\par
\par
        return this._isDSTShifted;\par
    \}\par
\par
    function isLocal() \{\par
        return this.isValid() ? !this._isUTC : false;\par
    \}\par
\par
    function isUtcOffset() \{\par
        return this.isValid() ? this._isUTC : false;\par
    \}\par
\par
    function isUtc() \{\par
        return this.isValid() ? this._isUTC && this._offset === 0 : false;\par
    \}\par
\par
    // ASP.NET json date format regex\par
    var aspNetRegex = /^(-|\\+)?(?:(\\d*)[. ])?(\\d+):(\\d+)(?::(\\d+)(\\.\\d*)?)?$/,\par
        // from {{\field{\*\fldinst{HYPERLINK http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html }}{\fldrslt{http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html\ul0\cf0}}}}\f0\fs22\par
        // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere\par
        // and further modified to allow for strings containing both week and day\par
        isoRegex =\par
            /^(-|\\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;\par
\par
    function createDuration(input, key) \{\par
        var duration = input,\par
            // matching against regexp is expensive, do it on demand\par
            match = null,\par
            sign,\par
            ret,\par
            diffRes;\par
\par
        if (isDuration(input)) \{\par
            duration = \{\par
                ms: input._milliseconds,\par
                d: input._days,\par
                M: input._months,\par
            \};\par
        \} else if (isNumber(input) || !isNaN(+input)) \{\par
            duration = \{\};\par
            if (key) \{\par
                duration[key] = +input;\par
            \} else \{\par
                duration.milliseconds = +input;\par
            \}\par
        \} else if ((match = aspNetRegex.exec(input))) \{\par
            sign = match[1] === '-' ? -1 : 1;\par
            duration = \{\par
                y: 0,\par
                d: toInt(match[DATE]) * sign,\par
                h: toInt(match[HOUR]) * sign,\par
                m: toInt(match[MINUTE]) * sign,\par
                s: toInt(match[SECOND]) * sign,\par
                ms: toInt(absRound(match[MILLISECOND] * 1000)) * sign, // the millisecond decimal point is included in the match\par
            \};\par
        \} else if ((match = isoRegex.exec(input))) \{\par
            sign = match[1] === '-' ? -1 : 1;\par
            duration = \{\par
                y: parseIso(match[2], sign),\par
                M: parseIso(match[3], sign),\par
                w: parseIso(match[4], sign),\par
                d: parseIso(match[5], sign),\par
                h: parseIso(match[6], sign),\par
                m: parseIso(match[7], sign),\par
                s: parseIso(match[8], sign),\par
            \};\par
        \} else if (duration == null) \{\par
            // checks for null or undefined\par
            duration = \{\};\par
        \} else if (\par
            typeof duration === 'object' &&\par
            ('from' in duration || 'to' in duration)\par
        ) \{\par
            diffRes = momentsDifference(\par
                createLocal(duration.from),\par
                createLocal(duration.to)\par
            );\par
\par
            duration = \{\};\par
            duration.ms = diffRes.milliseconds;\par
            duration.M = diffRes.months;\par
        \}\par
\par
        ret = new Duration(duration);\par
\par
        if (isDuration(input) && hasOwnProp(input, '_locale')) \{\par
            ret._locale = input._locale;\par
        \}\par
\par
        if (isDuration(input) && hasOwnProp(input, '_isValid')) \{\par
            ret._isValid = input._isValid;\par
        \}\par
\par
        return ret;\par
    \}\par
\par
    createDuration.fn = Duration.prototype;\par
    createDuration.invalid = createInvalid$1;\par
\par
    function parseIso(inp, sign) \{\par
        // We'd normally use ~~inp for this, but unfortunately it also\par
        // converts floats to ints.\par
        // inp may be undefined, so careful calling replace on it.\par
        var res = inp && parseFloat(inp.replace(',', '.'));\par
        // apply sign while we're at it\par
        return (isNaN(res) ? 0 : res) * sign;\par
    \}\par
\par
    function positiveMomentsDifference(base, other) \{\par
        var res = \{\};\par
\par
        res.months =\par
            other.month() - base.month() + (other.year() - base.year()) * 12;\par
        if (base.clone().add(res.months, 'M').isAfter(other)) \{\par
            --res.months;\par
        \}\par
\par
        res.milliseconds = +other - +base.clone().add(res.months, 'M');\par
\par
        return res;\par
    \}\par
\par
    function momentsDifference(base, other) \{\par
        var res;\par
        if (!(base.isValid() && other.isValid())) \{\par
            return \{ milliseconds: 0, months: 0 \};\par
        \}\par
\par
        other = cloneWithOffset(other, base);\par
        if (base.isBefore(other)) \{\par
            res = positiveMomentsDifference(base, other);\par
        \} else \{\par
            res = positiveMomentsDifference(other, base);\par
            res.milliseconds = -res.milliseconds;\par
            res.months = -res.months;\par
        \}\par
\par
        return res;\par
    \}\par
\par
    // TODO: remove 'name' arg after deprecation is removed\par
    function createAdder(direction, name) \{\par
        return function (val, period) \{\par
            var dur, tmp;\par
            //invert the arguments, but complain about it\par
            if (period !== null && !isNaN(+period)) \{\par
                deprecateSimple(\par
                    name,\par
                    'moment().' +\par
                        name +\par
                        '(period, number) is deprecated. Please use moment().' +\par
                        name +\par
                        '(number, period). ' +\par
                        'See {{\field{\*\fldinst{HYPERLINK http://momentjs.com/guides/#/warnings/add-inverted-param/ }}{\fldrslt{http://momentjs.com/guides/#/warnings/add-inverted-param/\ul0\cf0}}}}\f0\fs22  for more info.'\par
                );\par
                tmp = val;\par
                val = period;\par
                period = tmp;\par
            \}\par
\par
            dur = createDuration(val, period);\par
            addSubtract(this, dur, direction);\par
            return this;\par
        \};\par
    \}\par
\par
    function addSubtract(mom, duration, isAdding, updateOffset) \{\par
        var milliseconds = duration._milliseconds,\par
            days = absRound(duration._days),\par
            months = absRound(duration._months);\par
\par
        if (!mom.isValid()) \{\par
            // No op\par
            return;\par
        \}\par
\par
        updateOffset = updateOffset == null ? true : updateOffset;\par
\par
        if (months) \{\par
            setMonth(mom, get(mom, 'Month') + months * isAdding);\par
        \}\par
        if (days) \{\par
            set$1(mom, 'Date', get(mom, 'Date') + days * isAdding);\par
        \}\par
        if (milliseconds) \{\par
            mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);\par
        \}\par
        if (updateOffset) \{\par
            hooks.updateOffset(mom, days || months);\par
        \}\par
    \}\par
\par
    var add = createAdder(1, 'add'),\par
        subtract = createAdder(-1, 'subtract');\par
\par
    function isString(input) \{\par
        return typeof input === 'string' || input instanceof String;\par
    \}\par
\par
    // type MomentInput = Moment | Date | string | number | (number | string)[] | MomentInputObject | void; // null | undefined\par
    function isMomentInput(input) \{\par
        return (\par
            isMoment(input) ||\par
            isDate(input) ||\par
            isString(input) ||\par
            isNumber(input) ||\par
            isNumberOrStringArray(input) ||\par
            isMomentInputObject(input) ||\par
            input === null ||\par
            input === undefined\par
        );\par
    \}\par
\par
    function isMomentInputObject(input) \{\par
        var objectTest = isObject(input) && !isObjectEmpty(input),\par
            propertyTest = false,\par
            properties = [\par
                'years',\par
                'year',\par
                'y',\par
                'months',\par
                'month',\par
                'M',\par
                'days',\par
                'day',\par
                'd',\par
                'dates',\par
                'date',\par
                'D',\par
                'hours',\par
                'hour',\par
                'h',\par
                'minutes',\par
                'minute',\par
                'm',\par
                'seconds',\par
                'second',\par
                's',\par
                'milliseconds',\par
                'millisecond',\par
                'ms',\par
            ],\par
            i,\par
            property,\par
            propertyLen = properties.length;\par
\par
        for (i = 0; i < propertyLen; i += 1) \{\par
            property = properties[i];\par
            propertyTest = propertyTest || hasOwnProp(input, property);\par
        \}\par
\par
        return objectTest && propertyTest;\par
    \}\par
\par
    function isNumberOrStringArray(input) \{\par
        var arrayTest = isArray(input),\par
            dataTypeTest = false;\par
        if (arrayTest) \{\par
            dataTypeTest =\par
                input.filter(function (item) \{\par
                    return !isNumber(item) && isString(input);\par
                \}).length === 0;\par
        \}\par
        return arrayTest && dataTypeTest;\par
    \}\par
\par
    function isCalendarSpec(input) \{\par
        var objectTest = isObject(input) && !isObjectEmpty(input),\par
            propertyTest = false,\par
            properties = [\par
                'sameDay',\par
                'nextDay',\par
                'lastDay',\par
                'nextWeek',\par
                'lastWeek',\par
                'sameElse',\par
            ],\par
            i,\par
            property;\par
\par
        for (i = 0; i < properties.length; i += 1) \{\par
            property = properties[i];\par
            propertyTest = propertyTest || hasOwnProp(input, property);\par
        \}\par
\par
        return objectTest && propertyTest;\par
    \}\par
\par
    function getCalendarFormat(myMoment, now) \{\par
        var diff = myMoment.diff(now, 'days', true);\par
        return diff < -6\par
            ? 'sameElse'\par
            : diff < -1\par
              ? 'lastWeek'\par
              : diff < 0\par
                ? 'lastDay'\par
                : diff < 1\par
                  ? 'sameDay'\par
                  : diff < 2\par
                    ? 'nextDay'\par
                    : diff < 7\par
                      ? 'nextWeek'\par
                      : 'sameElse';\par
    \}\par
\par
    function calendar$1(time, formats) \{\par
        // Support for single parameter, formats only overload to the calendar function\par
        if (arguments.length === 1) \{\par
            if (!arguments[0]) \{\par
                time = undefined;\par
                formats = undefined;\par
            \} else if (isMomentInput(arguments[0])) \{\par
                time = arguments[0];\par
                formats = undefined;\par
            \} else if (isCalendarSpec(arguments[0])) \{\par
                formats = arguments[0];\par
                time = undefined;\par
            \}\par
        \}\par
        // We want to compare the start of today, vs this.\par
        // Getting start-of-today depends on whether we're local/utc/offset or not.\par
        var now = time || createLocal(),\par
            sod = cloneWithOffset(now, this).startOf('day'),\par
            format = hooks.calendarFormat(this, sod) || 'sameElse',\par
            output =\par
                formats &&\par
                (isFunction(formats[format])\par
                    ? formats[format].call(this, now)\par
                    : formats[format]);\par
\par
        return this.format(\par
            output || this.localeData().calendar(format, this, createLocal(now))\par
        );\par
    \}\par
\par
    function clone() \{\par
        return new Moment(this);\par
    \}\par
\par
    function isAfter(input, units) \{\par
        var localInput = isMoment(input) ? input : createLocal(input);\par
        if (!(this.isValid() && localInput.isValid())) \{\par
            return false;\par
        \}\par
        units = normalizeUnits(units) || 'millisecond';\par
        if (units === 'millisecond') \{\par
            return this.valueOf() > localInput.valueOf();\par
        \} else \{\par
            return localInput.valueOf() < this.clone().startOf(units).valueOf();\par
        \}\par
    \}\par
\par
    function isBefore(input, units) \{\par
        var localInput = isMoment(input) ? input : createLocal(input);\par
        if (!(this.isValid() && localInput.isValid())) \{\par
            return false;\par
        \}\par
        units = normalizeUnits(units) || 'millisecond';\par
        if (units === 'millisecond') \{\par
            return this.valueOf() < localInput.valueOf();\par
        \} else \{\par
            return this.clone().endOf(units).valueOf() < localInput.valueOf();\par
        \}\par
    \}\par
\par
    function isBetween(from, to, units, inclusivity) \{\par
        var localFrom = isMoment(from) ? from : createLocal(from),\par
            localTo = isMoment(to) ? to : createLocal(to);\par
        if (!(this.isValid() && localFrom.isValid() && localTo.isValid())) \{\par
            return false;\par
        \}\par
        inclusivity = inclusivity || '()';\par
        return (\par
            (inclusivity[0] === '('\par
                ? this.isAfter(localFrom, units)\par
                : !this.isBefore(localFrom, units)) &&\par
            (inclusivity[1] === ')'\par
                ? this.isBefore(localTo, units)\par
                : !this.isAfter(localTo, units))\par
        );\par
    \}\par
\par
    function isSame(input, units) \{\par
        var localInput = isMoment(input) ? input : createLocal(input),\par
            inputMs;\par
        if (!(this.isValid() && localInput.isValid())) \{\par
            return false;\par
        \}\par
        units = normalizeUnits(units) || 'millisecond';\par
        if (units === 'millisecond') \{\par
            return this.valueOf() === localInput.valueOf();\par
        \} else \{\par
            inputMs = localInput.valueOf();\par
            return (\par
                this.clone().startOf(units).valueOf() <= inputMs &&\par
                inputMs <= this.clone().endOf(units).valueOf()\par
            );\par
        \}\par
    \}\par
\par
    function isSameOrAfter(input, units) \{\par
        return this.isSame(input, units) || this.isAfter(input, units);\par
    \}\par
\par
    function isSameOrBefore(input, units) \{\par
        return this.isSame(input, units) || this.isBefore(input, units);\par
    \}\par
\par
    function diff(input, units, asFloat) \{\par
        var that, zoneDelta, output;\par
\par
        if (!this.isValid()) \{\par
            return NaN;\par
        \}\par
\par
        that = cloneWithOffset(input, this);\par
\par
        if (!that.isValid()) \{\par
            return NaN;\par
        \}\par
\par
        zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;\par
\par
        units = normalizeUnits(units);\par
\par
        switch (units) \{\par
            case 'year':\par
                output = monthDiff(this, that) / 12;\par
                break;\par
            case 'month':\par
                output = monthDiff(this, that);\par
                break;\par
            case 'quarter':\par
                output = monthDiff(this, that) / 3;\par
                break;\par
            case 'second':\par
                output = (this - that) / 1e3;\par
                break; // 1000\par
            case 'minute':\par
                output = (this - that) / 6e4;\par
                break; // 1000 * 60\par
            case 'hour':\par
                output = (this - that) / 36e5;\par
                break; // 1000 * 60 * 60\par
            case 'day':\par
                output = (this - that - zoneDelta) / 864e5;\par
                break; // 1000 * 60 * 60 * 24, negate dst\par
            case 'week':\par
                output = (this - that - zoneDelta) / 6048e5;\par
                break; // 1000 * 60 * 60 * 24 * 7, negate dst\par
            default:\par
                output = this - that;\par
        \}\par
\par
        return asFloat ? output : absFloor(output);\par
    \}\par
\par
    function monthDiff(a, b) \{\par
        if (a.date() < b.date()) \{\par
            // end-of-month calculations work correct when the start month has more\par
            // days than the end month.\par
            return -monthDiff(b, a);\par
        \}\par
        // difference in months\par
        var wholeMonthDiff = (b.year() - a.year()) * 12 + (b.month() - a.month()),\par
            // b is in (anchor - 1 month, anchor + 1 month)\par
            anchor = a.clone().add(wholeMonthDiff, 'months'),\par
            anchor2,\par
            adjust;\par
\par
        if (b - anchor < 0) \{\par
            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');\par
            // linear across the month\par
            adjust = (b - anchor) / (anchor - anchor2);\par
        \} else \{\par
            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');\par
            // linear across the month\par
            adjust = (b - anchor) / (anchor2 - anchor);\par
        \}\par
\par
        //check for negative zero, return zero if negative zero\par
        return -(wholeMonthDiff + adjust) || 0;\par
    \}\par
\par
    hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';\par
    hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';\par
\par
    function toString() \{\par
        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');\par
    \}\par
\par
    function toISOString(keepOffset) \{\par
        if (!this.isValid()) \{\par
            return null;\par
        \}\par
        var utc = keepOffset !== true,\par
            m = utc ? this.clone().utc() : this;\par
        if (m.year() < 0 || m.year() > 9999) \{\par
            return formatMoment(\par
                m,\par
                utc\par
                    ? 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]'\par
                    : 'YYYYYY-MM-DD[T]HH:mm:ss.SSSZ'\par
            );\par
        \}\par
        if (isFunction(Date.prototype.toISOString)) \{\par
            // native implementation is ~50x faster, use it when we can\par
            if (utc) \{\par
                return this.toDate().toISOString();\par
            \} else \{\par
                return new Date(this.valueOf() + this.utcOffset() * 60 * 1000)\par
                    .toISOString()\par
                    .replace('Z', formatMoment(m, 'Z'));\par
            \}\par
        \}\par
        return formatMoment(\par
            m,\par
            utc ? 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYY-MM-DD[T]HH:mm:ss.SSSZ'\par
        );\par
    \}\par
\par
    /**\par
     * Return a human readable representation of a moment that can\par
     * also be evaluated to get a new moment which is the same\par
     *\par
     * @link {{\field{\*\fldinst{HYPERLINK https://nodejs.org/dist/latest/docs/api/util.html#util_custom_inspect_function_on_objects }}{\fldrslt{https://nodejs.org/dist/latest/docs/api/util.html#util_custom_inspect_function_on_objects\ul0\cf0}}}}\f0\fs22\par
     */\par
    function inspect() \{\par
        if (!this.isValid()) \{\par
            return 'moment.invalid(/* ' + this._i + ' */)';\par
        \}\par
        var func = 'moment',\par
            zone = '',\par
            prefix,\par
            year,\par
            datetime,\par
            suffix;\par
        if (!this.isLocal()) \{\par
            func = this.utcOffset() === 0 ? 'moment.utc' : 'moment.parseZone';\par
            zone = 'Z';\par
        \}\par
        prefix = '[' + func + '("]';\par
        year = 0 <= this.year() && this.year() <= 9999 ? 'YYYY' : 'YYYYYY';\par
        datetime = '-MM-DD[T]HH:mm:ss.SSS';\par
        suffix = zone + '[")]';\par
\par
        return this.format(prefix + year + datetime + suffix);\par
    \}\par
\par
    function format(inputString) \{\par
        if (!inputString) \{\par
            inputString = this.isUtc()\par
                ? hooks.defaultFormatUtc\par
                : hooks.defaultFormat;\par
        \}\par
        var output = formatMoment(this, inputString);\par
        return this.localeData().postformat(output);\par
    \}\par
\par
    function from(time, withoutSuffix) \{\par
        if (\par
            this.isValid() &&\par
            ((isMoment(time) && time.isValid()) || createLocal(time).isValid())\par
        ) \{\par
            return createDuration(\{ to: this, from: time \})\par
                .locale(this.locale())\par
                .humanize(!withoutSuffix);\par
        \} else \{\par
            return this.localeData().invalidDate();\par
        \}\par
    \}\par
\par
    function fromNow(withoutSuffix) \{\par
        return this.from(createLocal(), withoutSuffix);\par
    \}\par
\par
    function to(time, withoutSuffix) \{\par
        if (\par
            this.isValid() &&\par
            ((isMoment(time) && time.isValid()) || createLocal(time).isValid())\par
        ) \{\par
            return createDuration(\{ from: this, to: time \})\par
                .locale(this.locale())\par
                .humanize(!withoutSuffix);\par
        \} else \{\par
            return this.localeData().invalidDate();\par
        \}\par
    \}\par
\par
    function toNow(withoutSuffix) \{\par
        return this.to(createLocal(), withoutSuffix);\par
    \}\par
\par
    // If passed a locale key, it will set the locale for this\par
    // instance.  Otherwise, it will return the locale configuration\par
    // variables for this instance.\par
    function locale(key) \{\par
        var newLocaleData;\par
\par
        if (key === undefined) \{\par
            return this._locale._abbr;\par
        \} else \{\par
            newLocaleData = getLocale(key);\par
            if (newLocaleData != null) \{\par
                this._locale = newLocaleData;\par
            \}\par
            return this;\par
        \}\par
    \}\par
\par
    var lang = deprecate(\par
        'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',\par
        function (key) \{\par
            if (key === undefined) \{\par
                return this.localeData();\par
            \} else \{\par
                return this.locale(key);\par
            \}\par
        \}\par
    );\par
\par
    function localeData() \{\par
        return this._locale;\par
    \}\par
\par
    var MS_PER_SECOND = 1000,\par
        MS_PER_MINUTE = 60 * MS_PER_SECOND,\par
        MS_PER_HOUR = 60 * MS_PER_MINUTE,\par
        MS_PER_400_YEARS = (365 * 400 + 97) * 24 * MS_PER_HOUR;\par
\par
    // actual modulo - handles negative numbers (for dates before 1970):\par
    function mod$1(dividend, divisor) \{\par
        return ((dividend % divisor) + divisor) % divisor;\par
    \}\par
\par
    function localStartOfDate(y, m, d) \{\par
        // the date constructor remaps years 0-99 to 1900-1999\par
        if (y < 100 && y >= 0) \{\par
            // preserve leap years using a full 400 year cycle, then reset\par
            return new Date(y + 400, m, d) - MS_PER_400_YEARS;\par
        \} else \{\par
            return new Date(y, m, d).valueOf();\par
        \}\par
    \}\par
\par
    function utcStartOfDate(y, m, d) \{\par
        // Date.UTC remaps years 0-99 to 1900-1999\par
        if (y < 100 && y >= 0) \{\par
            // preserve leap years using a full 400 year cycle, then reset\par
            return Date.UTC(y + 400, m, d) - MS_PER_400_YEARS;\par
        \} else \{\par
            return Date.UTC(y, m, d);\par
        \}\par
    \}\par
\par
    function startOf(units) \{\par
        var time, startOfDate;\par
        units = normalizeUnits(units);\par
        if (units === undefined || units === 'millisecond' || !this.isValid()) \{\par
            return this;\par
        \}\par
\par
        startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;\par
\par
        switch (units) \{\par
            case 'year':\par
                time = startOfDate(this.year(), 0, 1);\par
                break;\par
            case 'quarter':\par
                time = startOfDate(\par
                    this.year(),\par
                    this.month() - (this.month() % 3),\par
                    1\par
                );\par
                break;\par
            case 'month':\par
                time = startOfDate(this.year(), this.month(), 1);\par
                break;\par
            case 'week':\par
                time = startOfDate(\par
                    this.year(),\par
                    this.month(),\par
                    this.date() - this.weekday()\par
                );\par
                break;\par
            case 'isoWeek':\par
                time = startOfDate(\par
                    this.year(),\par
                    this.month(),\par
                    this.date() - (this.isoWeekday() - 1)\par
                );\par
                break;\par
            case 'day':\par
            case 'date':\par
                time = startOfDate(this.year(), this.month(), this.date());\par
                break;\par
            case 'hour':\par
                time = this._d.valueOf();\par
                time -= mod$1(\par
                    time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE),\par
                    MS_PER_HOUR\par
                );\par
                break;\par
            case 'minute':\par
                time = this._d.valueOf();\par
                time -= mod$1(time, MS_PER_MINUTE);\par
                break;\par
            case 'second':\par
                time = this._d.valueOf();\par
                time -= mod$1(time, MS_PER_SECOND);\par
                break;\par
        \}\par
\par
        this._d.setTime(time);\par
        hooks.updateOffset(this, true);\par
        return this;\par
    \}\par
\par
    function endOf(units) \{\par
        var time, startOfDate;\par
        units = normalizeUnits(units);\par
        if (units === undefined || units === 'millisecond' || !this.isValid()) \{\par
            return this;\par
        \}\par
\par
        startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;\par
\par
        switch (units) \{\par
            case 'year':\par
                time = startOfDate(this.year() + 1, 0, 1) - 1;\par
                break;\par
            case 'quarter':\par
                time =\par
                    startOfDate(\par
                        this.year(),\par
                        this.month() - (this.month() % 3) + 3,\par
                        1\par
                    ) - 1;\par
                break;\par
            case 'month':\par
                time = startOfDate(this.year(), this.month() + 1, 1) - 1;\par
                break;\par
            case 'week':\par
                time =\par
                    startOfDate(\par
                        this.year(),\par
                        this.month(),\par
                        this.date() - this.weekday() + 7\par
                    ) - 1;\par
                break;\par
            case 'isoWeek':\par
                time =\par
                    startOfDate(\par
                        this.year(),\par
                        this.month(),\par
                        this.date() - (this.isoWeekday() - 1) + 7\par
                    ) - 1;\par
                break;\par
            case 'day':\par
            case 'date':\par
                time = startOfDate(this.year(), this.month(), this.date() + 1) - 1;\par
                break;\par
            case 'hour':\par
                time = this._d.valueOf();\par
                time +=\par
                    MS_PER_HOUR -\par
                    mod$1(\par
                        time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE),\par
                        MS_PER_HOUR\par
                    ) -\par
                    1;\par
                break;\par
            case 'minute':\par
                time = this._d.valueOf();\par
                time += MS_PER_MINUTE - mod$1(time, MS_PER_MINUTE) - 1;\par
                break;\par
            case 'second':\par
                time = this._d.valueOf();\par
                time += MS_PER_SECOND - mod$1(time, MS_PER_SECOND) - 1;\par
                break;\par
        \}\par
\par
        this._d.setTime(time);\par
        hooks.updateOffset(this, true);\par
        return this;\par
    \}\par
\par
    function valueOf() \{\par
        return this._d.valueOf() - (this._offset || 0) * 60000;\par
    \}\par
\par
    function unix() \{\par
        return Math.floor(this.valueOf() / 1000);\par
    \}\par
\par
    function toDate() \{\par
        return new Date(this.valueOf());\par
    \}\par
\par
    function toArray() \{\par
        var m = this;\par
        return [\par
            m.year(),\par
            m.month(),\par
            m.date(),\par
            m.hour(),\par
            m.minute(),\par
            m.second(),\par
            m.millisecond(),\par
        ];\par
    \}\par
\par
    function toObject() \{\par
        var m = this;\par
        return \{\par
            years: m.year(),\par
            months: m.month(),\par
            date: m.date(),\par
            hours: m.hours(),\par
            minutes: m.minutes(),\par
            seconds: m.seconds(),\par
            milliseconds: m.milliseconds(),\par
        \};\par
    \}\par
\par
    function toJSON() \{\par
        // new Date(NaN).toJSON() === null\par
        return this.isValid() ? this.toISOString() : null;\par
    \}\par
\par
    function isValid$2() \{\par
        return isValid(this);\par
    \}\par
\par
    function parsingFlags() \{\par
        return extend(\{\}, getParsingFlags(this));\par
    \}\par
\par
    function invalidAt() \{\par
        return getParsingFlags(this).overflow;\par
    \}\par
\par
    function creationData() \{\par
        return \{\par
            input: this._i,\par
            format: this._f,\par
            locale: this._locale,\par
            isUTC: this._isUTC,\par
            strict: this._strict,\par
        \};\par
    \}\par
\par
    addFormatToken('N', 0, 0, 'eraAbbr');\par
    addFormatToken('NN', 0, 0, 'eraAbbr');\par
    addFormatToken('NNN', 0, 0, 'eraAbbr');\par
    addFormatToken('NNNN', 0, 0, 'eraName');\par
    addFormatToken('NNNNN', 0, 0, 'eraNarrow');\par
\par
    addFormatToken('y', ['y', 1], 'yo', 'eraYear');\par
    addFormatToken('y', ['yy', 2], 0, 'eraYear');\par
    addFormatToken('y', ['yyy', 3], 0, 'eraYear');\par
    addFormatToken('y', ['yyyy', 4], 0, 'eraYear');\par
\par
    addRegexToken('N', matchEraAbbr);\par
    addRegexToken('NN', matchEraAbbr);\par
    addRegexToken('NNN', matchEraAbbr);\par
    addRegexToken('NNNN', matchEraName);\par
    addRegexToken('NNNNN', matchEraNarrow);\par
\par
    addParseToken(\par
        ['N', 'NN', 'NNN', 'NNNN', 'NNNNN'],\par
        function (input, array, config, token) \{\par
            var era = config._locale.erasParse(input, token, config._strict);\par
            if (era) \{\par
                getParsingFlags(config).era = era;\par
            \} else \{\par
                getParsingFlags(config).invalidEra = input;\par
            \}\par
        \}\par
    );\par
\par
    addRegexToken('y', matchUnsigned);\par
    addRegexToken('yy', matchUnsigned);\par
    addRegexToken('yyy', matchUnsigned);\par
    addRegexToken('yyyy', matchUnsigned);\par
    addRegexToken('yo', matchEraYearOrdinal);\par
\par
    addParseToken(['y', 'yy', 'yyy', 'yyyy'], YEAR);\par
    addParseToken(['yo'], function (input, array, config, token) \{\par
        var match;\par
        if (config._locale._eraYearOrdinalRegex) \{\par
            match = input.match(config._locale._eraYearOrdinalRegex);\par
        \}\par
\par
        if (config._locale.eraYearOrdinalParse) \{\par
            array[YEAR] = config._locale.eraYearOrdinalParse(input, match);\par
        \} else \{\par
            array[YEAR] = parseInt(input, 10);\par
        \}\par
    \});\par
\par
    function localeEras(m, format) \{\par
        var i,\par
            l,\par
            date,\par
            eras = this._eras || getLocale('en')._eras;\par
        for (i = 0, l = eras.length; i < l; ++i) \{\par
            switch (typeof eras[i].since) \{\par
                case 'string':\par
                    // truncate time\par
                    date = hooks(eras[i].since).startOf('day');\par
                    eras[i].since = date.valueOf();\par
                    break;\par
            \}\par
\par
            switch (typeof eras[i].until) \{\par
                case 'undefined':\par
                    eras[i].until = +Infinity;\par
                    break;\par
                case 'string':\par
                    // truncate time\par
                    date = hooks(eras[i].until).startOf('day').valueOf();\par
                    eras[i].until = date.valueOf();\par
                    break;\par
            \}\par
        \}\par
        return eras;\par
    \}\par
\par
    function localeErasParse(eraName, format, strict) \{\par
        var i,\par
            l,\par
            eras = this.eras(),\par
            name,\par
            abbr,\par
            narrow;\par
        eraName = eraName.toUpperCase();\par
\par
        for (i = 0, l = eras.length; i < l; ++i) \{\par
            name = eras[i].name.toUpperCase();\par
            abbr = eras[i].abbr.toUpperCase();\par
            narrow = eras[i].narrow.toUpperCase();\par
\par
            if (strict) \{\par
                switch (format) \{\par
                    case 'N':\par
                    case 'NN':\par
                    case 'NNN':\par
                        if (abbr === eraName) \{\par
                            return eras[i];\par
                        \}\par
                        break;\par
\par
                    case 'NNNN':\par
                        if (name === eraName) \{\par
                            return eras[i];\par
                        \}\par
                        break;\par
\par
                    case 'NNNNN':\par
                        if (narrow === eraName) \{\par
                            return eras[i];\par
                        \}\par
                        break;\par
                \}\par
            \} else if ([name, abbr, narrow].indexOf(eraName) >= 0) \{\par
                return eras[i];\par
            \}\par
        \}\par
    \}\par
\par
    function localeErasConvertYear(era, year) \{\par
        var dir = era.since <= era.until ? +1 : -1;\par
        if (year === undefined) \{\par
            return hooks(era.since).year();\par
        \} else \{\par
            return hooks(era.since).year() + (year - era.offset) * dir;\par
        \}\par
    \}\par
\par
    function getEraName() \{\par
        var i,\par
            l,\par
            val,\par
            eras = this.localeData().eras();\par
        for (i = 0, l = eras.length; i < l; ++i) \{\par
            // truncate time\par
            val = this.clone().startOf('day').valueOf();\par
\par
            if (eras[i].since <= val && val <= eras[i].until) \{\par
                return eras[i].name;\par
            \}\par
            if (eras[i].until <= val && val <= eras[i].since) \{\par
                return eras[i].name;\par
            \}\par
        \}\par
\par
        return '';\par
    \}\par
\par
    function getEraNarrow() \{\par
        var i,\par
            l,\par
            val,\par
            eras = this.localeData().eras();\par
        for (i = 0, l = eras.length; i < l; ++i) \{\par
            // truncate time\par
            val = this.clone().startOf('day').valueOf();\par
\par
            if (eras[i].since <= val && val <= eras[i].until) \{\par
                return eras[i].narrow;\par
            \}\par
            if (eras[i].until <= val && val <= eras[i].since) \{\par
                return eras[i].narrow;\par
            \}\par
        \}\par
\par
        return '';\par
    \}\par
\par
    function getEraAbbr() \{\par
        var i,\par
            l,\par
            val,\par
            eras = this.localeData().eras();\par
        for (i = 0, l = eras.length; i < l; ++i) \{\par
            // truncate time\par
            val = this.clone().startOf('day').valueOf();\par
\par
            if (eras[i].since <= val && val <= eras[i].until) \{\par
                return eras[i].abbr;\par
            \}\par
            if (eras[i].until <= val && val <= eras[i].since) \{\par
                return eras[i].abbr;\par
            \}\par
        \}\par
\par
        return '';\par
    \}\par
\par
    function getEraYear() \{\par
        var i,\par
            l,\par
            dir,\par
            val,\par
            eras = this.localeData().eras();\par
        for (i = 0, l = eras.length; i < l; ++i) \{\par
            dir = eras[i].since <= eras[i].until ? +1 : -1;\par
\par
            // truncate time\par
            val = this.clone().startOf('day').valueOf();\par
\par
            if (\par
                (eras[i].since <= val && val <= eras[i].until) ||\par
                (eras[i].until <= val && val <= eras[i].since)\par
            ) \{\par
                return (\par
                    (this.year() - hooks(eras[i].since).year()) * dir +\par
                    eras[i].offset\par
                );\par
            \}\par
        \}\par
\par
        return this.year();\par
    \}\par
\par
    function erasNameRegex(isStrict) \{\par
        if (!hasOwnProp(this, '_erasNameRegex')) \{\par
            computeErasParse.call(this);\par
        \}\par
        return isStrict ? this._erasNameRegex : this._erasRegex;\par
    \}\par
\par
    function erasAbbrRegex(isStrict) \{\par
        if (!hasOwnProp(this, '_erasAbbrRegex')) \{\par
            computeErasParse.call(this);\par
        \}\par
        return isStrict ? this._erasAbbrRegex : this._erasRegex;\par
    \}\par
\par
    function erasNarrowRegex(isStrict) \{\par
        if (!hasOwnProp(this, '_erasNarrowRegex')) \{\par
            computeErasParse.call(this);\par
        \}\par
        return isStrict ? this._erasNarrowRegex : this._erasRegex;\par
    \}\par
\par
    function matchEraAbbr(isStrict, locale) \{\par
        return locale.erasAbbrRegex(isStrict);\par
    \}\par
\par
    function matchEraName(isStrict, locale) \{\par
        return locale.erasNameRegex(isStrict);\par
    \}\par
\par
    function matchEraNarrow(isStrict, locale) \{\par
        return locale.erasNarrowRegex(isStrict);\par
    \}\par
\par
    function matchEraYearOrdinal(isStrict, locale) \{\par
        return locale._eraYearOrdinalRegex || matchUnsigned;\par
    \}\par
\par
    function computeErasParse() \{\par
        var abbrPieces = [],\par
            namePieces = [],\par
            narrowPieces = [],\par
            mixedPieces = [],\par
            i,\par
            l,\par
            erasName,\par
            erasAbbr,\par
            erasNarrow,\par
            eras = this.eras();\par
\par
        for (i = 0, l = eras.length; i < l; ++i) \{\par
            erasName = regexEscape(eras[i].name);\par
            erasAbbr = regexEscape(eras[i].abbr);\par
            erasNarrow = regexEscape(eras[i].narrow);\par
\par
            namePieces.push(erasName);\par
            abbrPieces.push(erasAbbr);\par
            narrowPieces.push(erasNarrow);\par
            mixedPieces.push(erasName);\par
            mixedPieces.push(erasAbbr);\par
            mixedPieces.push(erasNarrow);\par
        \}\par
\par
        this._erasRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');\par
        this._erasNameRegex = new RegExp('^(' + namePieces.join('|') + ')', 'i');\par
        this._erasAbbrRegex = new RegExp('^(' + abbrPieces.join('|') + ')', 'i');\par
        this._erasNarrowRegex = new RegExp(\par
            '^(' + narrowPieces.join('|') + ')',\par
            'i'\par
        );\par
    \}\par
\par
    // FORMATTING\par
\par
    addFormatToken(0, ['gg', 2], 0, function () \{\par
        return this.weekYear() % 100;\par
    \});\par
\par
    addFormatToken(0, ['GG', 2], 0, function () \{\par
        return this.isoWeekYear() % 100;\par
    \});\par
\par
    function addWeekYearFormatToken(token, getter) \{\par
        addFormatToken(0, [token, token.length], 0, getter);\par
    \}\par
\par
    addWeekYearFormatToken('gggg', 'weekYear');\par
    addWeekYearFormatToken('ggggg', 'weekYear');\par
    addWeekYearFormatToken('GGGG', 'isoWeekYear');\par
    addWeekYearFormatToken('GGGGG', 'isoWeekYear');\par
\par
    // ALIASES\par
\par
    // PARSING\par
\par
    addRegexToken('G', matchSigned);\par
    addRegexToken('g', matchSigned);\par
    addRegexToken('GG', match1to2, match2);\par
    addRegexToken('gg', match1to2, match2);\par
    addRegexToken('GGGG', match1to4, match4);\par
    addRegexToken('gggg', match1to4, match4);\par
    addRegexToken('GGGGG', match1to6, match6);\par
    addRegexToken('ggggg', match1to6, match6);\par
\par
    addWeekParseToken(\par
        ['gggg', 'ggggg', 'GGGG', 'GGGGG'],\par
        function (input, week, config, token) \{\par
            week[token.substr(0, 2)] = toInt(input);\par
        \}\par
    );\par
\par
    addWeekParseToken(['gg', 'GG'], function (input, week, config, token) \{\par
        week[token] = hooks.parseTwoDigitYear(input);\par
    \});\par
\par
    // MOMENTS\par
\par
    function getSetWeekYear(input) \{\par
        return getSetWeekYearHelper.call(\par
            this,\par
            input,\par
            this.week(),\par
            this.weekday() + this.localeData()._week.dow,\par
            this.localeData()._week.dow,\par
            this.localeData()._week.doy\par
        );\par
    \}\par
\par
    function getSetISOWeekYear(input) \{\par
        return getSetWeekYearHelper.call(\par
            this,\par
            input,\par
            this.isoWeek(),\par
            this.isoWeekday(),\par
            1,\par
            4\par
        );\par
    \}\par
\par
    function getISOWeeksInYear() \{\par
        return weeksInYear(this.year(), 1, 4);\par
    \}\par
\par
    function getISOWeeksInISOWeekYear() \{\par
        return weeksInYear(this.isoWeekYear(), 1, 4);\par
    \}\par
\par
    function getWeeksInYear() \{\par
        var weekInfo = this.localeData()._week;\par
        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);\par
    \}\par
\par
    function getWeeksInWeekYear() \{\par
        var weekInfo = this.localeData()._week;\par
        return weeksInYear(this.weekYear(), weekInfo.dow, weekInfo.doy);\par
    \}\par
\par
    function getSetWeekYearHelper(input, week, weekday, dow, doy) \{\par
        var weeksTarget;\par
        if (input == null) \{\par
            return weekOfYear(this, dow, doy).year;\par
        \} else \{\par
            weeksTarget = weeksInYear(input, dow, doy);\par
            if (week > weeksTarget) \{\par
                week = weeksTarget;\par
            \}\par
            return setWeekAll.call(this, input, week, weekday, dow, doy);\par
        \}\par
    \}\par
\par
    function setWeekAll(weekYear, week, weekday, dow, doy) \{\par
        var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),\par
            date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);\par
\par
        this.year(date.getUTCFullYear());\par
        this.month(date.getUTCMonth());\par
        this.date(date.getUTCDate());\par
        return this;\par
    \}\par
\par
    // FORMATTING\par
\par
    addFormatToken('Q', 0, 'Qo', 'quarter');\par
\par
    // PARSING\par
\par
    addRegexToken('Q', match1);\par
    addParseToken('Q', function (input, array) \{\par
        array[MONTH] = (toInt(input) - 1) * 3;\par
    \});\par
\par
    // MOMENTS\par
\par
    function getSetQuarter(input) \{\par
        return input == null\par
            ? Math.ceil((this.month() + 1) / 3)\par
            : this.month((input - 1) * 3 + (this.month() % 3));\par
    \}\par
\par
    // FORMATTING\par
\par
    addFormatToken('D', ['DD', 2], 'Do', 'date');\par
\par
    // PARSING\par
\par
    addRegexToken('D', match1to2, match1to2NoLeadingZero);\par
    addRegexToken('DD', match1to2, match2);\par
    addRegexToken('Do', function (isStrict, locale) \{\par
        // TODO: Remove "ordinalParse" fallback in next major release.\par
        return isStrict\par
            ? locale._dayOfMonthOrdinalParse || locale._ordinalParse\par
            : locale._dayOfMonthOrdinalParseLenient;\par
    \});\par
\par
    addParseToken(['D', 'DD'], DATE);\par
    addParseToken('Do', function (input, array) \{\par
        array[DATE] = toInt(input.match(match1to2)[0]);\par
    \});\par
\par
    // MOMENTS\par
\par
    var getSetDayOfMonth = makeGetSet('Date', true);\par
\par
    // FORMATTING\par
\par
    addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');\par
\par
    // PARSING\par
\par
    addRegexToken('DDD', match1to3);\par
    addRegexToken('DDDD', match3);\par
    addParseToken(['DDD', 'DDDD'], function (input, array, config) \{\par
        config._dayOfYear = toInt(input);\par
    \});\par
\par
    // HELPERS\par
\par
    // MOMENTS\par
\par
    function getSetDayOfYear(input) \{\par
        var dayOfYear =\par
            Math.round(\par
                (this.clone().startOf('day') - this.clone().startOf('year')) / 864e5\par
            ) + 1;\par
        return input == null ? dayOfYear : this.add(input - dayOfYear, 'd');\par
    \}\par
\par
    // FORMATTING\par
\par
    addFormatToken('m', ['mm', 2], 0, 'minute');\par
\par
    // PARSING\par
\par
    addRegexToken('m', match1to2, match1to2HasZero);\par
    addRegexToken('mm', match1to2, match2);\par
    addParseToken(['m', 'mm'], MINUTE);\par
\par
    // MOMENTS\par
\par
    var getSetMinute = makeGetSet('Minutes', false);\par
\par
    // FORMATTING\par
\par
    addFormatToken('s', ['ss', 2], 0, 'second');\par
\par
    // PARSING\par
\par
    addRegexToken('s', match1to2, match1to2HasZero);\par
    addRegexToken('ss', match1to2, match2);\par
    addParseToken(['s', 'ss'], SECOND);\par
\par
    // MOMENTS\par
\par
    var getSetSecond = makeGetSet('Seconds', false);\par
\par
    // FORMATTING\par
\par
    addFormatToken('S', 0, 0, function () \{\par
        return ~~(this.millisecond() / 100);\par
    \});\par
\par
    addFormatToken(0, ['SS', 2], 0, function () \{\par
        return ~~(this.millisecond() / 10);\par
    \});\par
\par
    addFormatToken(0, ['SSS', 3], 0, 'millisecond');\par
    addFormatToken(0, ['SSSS', 4], 0, function () \{\par
        return this.millisecond() * 10;\par
    \});\par
    addFormatToken(0, ['SSSSS', 5], 0, function () \{\par
        return this.millisecond() * 100;\par
    \});\par
    addFormatToken(0, ['SSSSSS', 6], 0, function () \{\par
        return this.millisecond() * 1000;\par
    \});\par
    addFormatToken(0, ['SSSSSSS', 7], 0, function () \{\par
        return this.millisecond() * 10000;\par
    \});\par
    addFormatToken(0, ['SSSSSSSS', 8], 0, function () \{\par
        return this.millisecond() * 100000;\par
    \});\par
    addFormatToken(0, ['SSSSSSSSS', 9], 0, function () \{\par
        return this.millisecond() * 1000000;\par
    \});\par
\par
    // PARSING\par
\par
    addRegexToken('S', match1to3, match1);\par
    addRegexToken('SS', match1to3, match2);\par
    addRegexToken('SSS', match1to3, match3);\par
\par
    var token, getSetMillisecond;\par
    for (token = 'SSSS'; token.length <= 9; token += 'S') \{\par
        addRegexToken(token, matchUnsigned);\par
    \}\par
\par
    function parseMs(input, array) \{\par
        array[MILLISECOND] = toInt(('0.' + input) * 1000);\par
    \}\par
\par
    for (token = 'S'; token.length <= 9; token += 'S') \{\par
        addParseToken(token, parseMs);\par
    \}\par
\par
    getSetMillisecond = makeGetSet('Milliseconds', false);\par
\par
    // FORMATTING\par
\par
    addFormatToken('z', 0, 0, 'zoneAbbr');\par
    addFormatToken('zz', 0, 0, 'zoneName');\par
\par
    // MOMENTS\par
\par
    function getZoneAbbr() \{\par
        return this._isUTC ? 'UTC' : '';\par
    \}\par
\par
    function getZoneName() \{\par
        return this._isUTC ? 'Coordinated Universal Time' : '';\par
    \}\par
\par
    var proto = Moment.prototype;\par
\par
    proto.add = add;\par
    proto.calendar = calendar$1;\par
    proto.clone = clone;\par
    proto.diff = diff;\par
    proto.endOf = endOf;\par
    proto.format = format;\par
    proto.from = from;\par
    proto.fromNow = fromNow;\par
    proto.to = to;\par
    proto.toNow = toNow;\par
    proto.get = stringGet;\par
    proto.invalidAt = invalidAt;\par
    proto.isAfter = isAfter;\par
    proto.isBefore = isBefore;\par
    proto.isBetween = isBetween;\par
    proto.isSame = isSame;\par
    proto.isSameOrAfter = isSameOrAfter;\par
    proto.isSameOrBefore = isSameOrBefore;\par
    proto.isValid = isValid$2;\par
    proto.lang = lang;\par
    proto.locale = locale;\par
    proto.localeData = localeData;\par
    proto.max = prototypeMax;\par
    proto.min = prototypeMin;\par
    proto.parsingFlags = parsingFlags;\par
    proto.set = stringSet;\par
    proto.startOf = startOf;\par
    proto.subtract = subtract;\par
    proto.toArray = toArray;\par
    proto.toObject = toObject;\par
    proto.toDate = toDate;\par
    proto.toISOString = toISOString;\par
    proto.inspect = inspect;\par
    if (typeof Symbol !== 'undefined' && Symbol.for != null) \{\par
        proto[Symbol.for('nodejs.util.inspect.custom')] = function () \{\par
            return 'Moment<' + this.format() + '>';\par
        \};\par
    \}\par
    proto.toJSON = toJSON;\par
    proto.toString = toString;\par
    proto.unix = unix;\par
    proto.valueOf = valueOf;\par
    proto.creationData = creationData;\par
    proto.eraName = getEraName;\par
    proto.eraNarrow = getEraNarrow;\par
    proto.eraAbbr = getEraAbbr;\par
    proto.eraYear = getEraYear;\par
    proto.year = getSetYear;\par
    proto.isLeapYear = getIsLeapYear;\par
    proto.weekYear = getSetWeekYear;\par
    proto.isoWeekYear = getSetISOWeekYear;\par
    proto.quarter = proto.quarters = getSetQuarter;\par
    proto.month = getSetMonth;\par
    proto.daysInMonth = getDaysInMonth;\par
    proto.week = proto.weeks = getSetWeek;\par
    proto.isoWeek = proto.isoWeeks = getSetISOWeek;\par
    proto.weeksInYear = getWeeksInYear;\par
    proto.weeksInWeekYear = getWeeksInWeekYear;\par
    proto.isoWeeksInYear = getISOWeeksInYear;\par
    proto.isoWeeksInISOWeekYear = getISOWeeksInISOWeekYear;\par
    proto.date = getSetDayOfMonth;\par
    proto.day = proto.days = getSetDayOfWeek;\par
    proto.weekday = getSetLocaleDayOfWeek;\par
    proto.isoWeekday = getSetISODayOfWeek;\par
    proto.dayOfYear = getSetDayOfYear;\par
    proto.hour = proto.hours = getSetHour;\par
    proto.minute = proto.minutes = getSetMinute;\par
    proto.second = proto.seconds = getSetSecond;\par
    proto.millisecond = proto.milliseconds = getSetMillisecond;\par
    proto.utcOffset = getSetOffset;\par
    proto.utc = setOffsetToUTC;\par
    proto.local = setOffsetToLocal;\par
    proto.parseZone = setOffsetToParsedOffset;\par
    proto.hasAlignedHourOffset = hasAlignedHourOffset;\par
    proto.isDST = isDaylightSavingTime;\par
    proto.isLocal = isLocal;\par
    proto.isUtcOffset = isUtcOffset;\par
    proto.isUtc = isUtc;\par
    proto.isUTC = isUtc;\par
    proto.zoneAbbr = getZoneAbbr;\par
    proto.zoneName = getZoneName;\par
    proto.dates = deprecate(\par
        'dates accessor is deprecated. Use date instead.',\par
        getSetDayOfMonth\par
    );\par
    proto.months = deprecate(\par
        'months accessor is deprecated. Use month instead',\par
        getSetMonth\par
    );\par
    proto.years = deprecate(\par
        'years accessor is deprecated. Use year instead',\par
        getSetYear\par
    );\par
    proto.zone = deprecate(\par
        'moment().zone is deprecated, use moment().utcOffset instead. {{\field{\*\fldinst{HYPERLINK http://momentjs.com/guides/#/warnings/zone/' }}{\fldrslt{http://momentjs.com/guides/#/warnings/zone/'\ul0\cf0}}}}\f0\fs22 ,\par
        getSetZone\par
    );\par
    proto.isDSTShifted = deprecate(\par
        'isDSTShifted is deprecated. See {{\field{\*\fldinst{HYPERLINK http://momentjs.com/guides/#/warnings/dst-shifted/ }}{\fldrslt{http://momentjs.com/guides/#/warnings/dst-shifted/\ul0\cf0}}}}\f0\fs22  for more information',\par
        isDaylightSavingTimeShifted\par
    );\par
\par
    function createUnix(input) \{\par
        return createLocal(input * 1000);\par
    \}\par
\par
    function createInZone() \{\par
        return createLocal.apply(null, arguments).parseZone();\par
    \}\par
\par
    function preParsePostFormat(string) \{\par
        return string;\par
    \}\par
\par
    var proto$1 = Locale.prototype;\par
\par
    proto$1.calendar = calendar;\par
    proto$1.longDateFormat = longDateFormat;\par
    proto$1.invalidDate = invalidDate;\par
    proto$1.ordinal = ordinal;\par
    proto$1.preparse = preParsePostFormat;\par
    proto$1.postformat = preParsePostFormat;\par
    proto$1.relativeTime = relativeTime;\par
    proto$1.pastFuture = pastFuture;\par
    proto$1.set = set;\par
    proto$1.eras = localeEras;\par
    proto$1.erasParse = localeErasParse;\par
    proto$1.erasConvertYear = localeErasConvertYear;\par
    proto$1.erasAbbrRegex = erasAbbrRegex;\par
    proto$1.erasNameRegex = erasNameRegex;\par
    proto$1.erasNarrowRegex = erasNarrowRegex;\par
\par
    proto$1.months = localeMonths;\par
    proto$1.monthsShort = localeMonthsShort;\par
    proto$1.monthsParse = localeMonthsParse;\par
    proto$1.monthsRegex = monthsRegex;\par
    proto$1.monthsShortRegex = monthsShortRegex;\par
    proto$1.week = localeWeek;\par
    proto$1.firstDayOfYear = localeFirstDayOfYear;\par
    proto$1.firstDayOfWeek = localeFirstDayOfWeek;\par
\par
    proto$1.weekdays = localeWeekdays;\par
    proto$1.weekdaysMin = localeWeekdaysMin;\par
    proto$1.weekdaysShort = localeWeekdaysShort;\par
    proto$1.weekdaysParse = localeWeekdaysParse;\par
\par
    proto$1.weekdaysRegex = weekdaysRegex;\par
    proto$1.weekdaysShortRegex = weekdaysShortRegex;\par
    proto$1.weekdaysMinRegex = weekdaysMinRegex;\par
\par
    proto$1.isPM = localeIsPM;\par
    proto$1.meridiem = localeMeridiem;\par
\par
    function get$1(format, index, field, setter) \{\par
        var locale = getLocale(),\par
            utc = createUTC().set(setter, index);\par
        return locale[field](utc, format);\par
    \}\par
\par
    function listMonthsImpl(format, index, field) \{\par
        if (isNumber(format)) \{\par
            index = format;\par
            format = undefined;\par
        \}\par
\par
        format = format || '';\par
\par
        if (index != null) \{\par
            return get$1(format, index, field, 'month');\par
        \}\par
\par
        var i,\par
            out = [];\par
        for (i = 0; i < 12; i++) \{\par
            out[i] = get$1(format, i, field, 'month');\par
        \}\par
        return out;\par
    \}\par
\par
    // ()\par
    // (5)\par
    // (fmt, 5)\par
    // (fmt)\par
    // (true)\par
    // (true, 5)\par
    // (true, fmt, 5)\par
    // (true, fmt)\par
    function listWeekdaysImpl(localeSorted, format, index, field) \{\par
        if (typeof localeSorted === 'boolean') \{\par
            if (isNumber(format)) \{\par
                index = format;\par
                format = undefined;\par
            \}\par
\par
            format = format || '';\par
        \} else \{\par
            format = localeSorted;\par
            index = format;\par
            localeSorted = false;\par
\par
            if (isNumber(format)) \{\par
                index = format;\par
                format = undefined;\par
            \}\par
\par
            format = format || '';\par
        \}\par
\par
        var locale = getLocale(),\par
            shift = localeSorted ? locale._week.dow : 0,\par
            i,\par
            out = [];\par
\par
        if (index != null) \{\par
            return get$1(format, (index + shift) % 7, field, 'day');\par
        \}\par
\par
        for (i = 0; i < 7; i++) \{\par
            out[i] = get$1(format, (i + shift) % 7, field, 'day');\par
        \}\par
        return out;\par
    \}\par
\par
    function listMonths(format, index) \{\par
        return listMonthsImpl(format, index, 'months');\par
    \}\par
\par
    function listMonthsShort(format, index) \{\par
        return listMonthsImpl(format, index, 'monthsShort');\par
    \}\par
\par
    function listWeekdays(localeSorted, format, index) \{\par
        return listWeekdaysImpl(localeSorted, format, index, 'weekdays');\par
    \}\par
\par
    function listWeekdaysShort(localeSorted, format, index) \{\par
        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');\par
    \}\par
\par
    function listWeekdaysMin(localeSorted, format, index) \{\par
        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');\par
    \}\par
\par
    getSetGlobalLocale('en', \{\par
        eras: [\par
            \{\par
                since: '0001-01-01',\par
                until: +Infinity,\par
                offset: 1,\par
                name: 'Anno Domini',\par
                narrow: 'AD',\par
                abbr: 'AD',\par
            \},\par
            \{\par
                since: '0000-12-31',\par
                until: -Infinity,\par
                offset: 1,\par
                name: 'Before Christ',\par
                narrow: 'BC',\par
                abbr: 'BC',\par
            \},\par
        ],\par
        dayOfMonthOrdinalParse: /\\d\{1,2\}(th|st|nd|rd)/,\par
        ordinal: function (number) \{\par
            var b = number % 10,\par
                output =\par
                    toInt((number % 100) / 10) === 1\par
                        ? 'th'\par
                        : b === 1\par
                          ? 'st'\par
                          : b === 2\par
                            ? 'nd'\par
                            : b === 3\par
                              ? 'rd'\par
                              : 'th';\par
            return number + output;\par
        \},\par
    \});\par
\par
    // Side effect imports\par
\par
    hooks.lang = deprecate(\par
        'moment.lang is deprecated. Use moment.locale instead.',\par
        getSetGlobalLocale\par
    );\par
    hooks.langData = deprecate(\par
        'moment.langData is deprecated. Use moment.localeData instead.',\par
        getLocale\par
    );\par
\par
    var mathAbs = Math.abs;\par
\par
    function abs() \{\par
        var data = this._data;\par
\par
        this._milliseconds = mathAbs(this._milliseconds);\par
        this._days = mathAbs(this._days);\par
        this._months = mathAbs(this._months);\par
\par
        data.milliseconds = mathAbs(data.milliseconds);\par
        data.seconds = mathAbs(data.seconds);\par
        data.minutes = mathAbs(data.minutes);\par
        data.hours = mathAbs(data.hours);\par
        data.months = mathAbs(data.months);\par
        data.years = mathAbs(data.years);\par
\par
        return this;\par
    \}\par
\par
    function addSubtract$1(duration, input, value, direction) \{\par
        var other = createDuration(input, value);\par
\par
        duration._milliseconds += direction * other._milliseconds;\par
        duration._days += direction * other._days;\par
        duration._months += direction * other._months;\par
\par
        return duration._bubble();\par
    \}\par
\par
    // supports only 2.0-style add(1, 's') or add(duration)\par
    function add$1(input, value) \{\par
        return addSubtract$1(this, input, value, 1);\par
    \}\par
\par
    // supports only 2.0-style subtract(1, 's') or subtract(duration)\par
    function subtract$1(input, value) \{\par
        return addSubtract$1(this, input, value, -1);\par
    \}\par
\par
    function absCeil(number) \{\par
        if (number < 0) \{\par
            return Math.floor(number);\par
        \} else \{\par
            return Math.ceil(number);\par
        \}\par
    \}\par
\par
    function bubble() \{\par
        var milliseconds = this._milliseconds,\par
            days = this._days,\par
            months = this._months,\par
            data = this._data,\par
            seconds,\par
            minutes,\par
            hours,\par
            years,\par
            monthsFromDays;\par
\par
        // if we have a mix of positive and negative values, bubble down first\par
        // check: {{\field{\*\fldinst{HYPERLINK https://github.com/moment/moment/issues/2166 }}{\fldrslt{https://github.com/moment/moment/issues/2166\ul0\cf0}}}}\f0\fs22\par
        if (\par
            !(\par
                (milliseconds >= 0 && days >= 0 && months >= 0) ||\par
                (milliseconds <= 0 && days <= 0 && months <= 0)\par
            )\par
        ) \{\par
            milliseconds += absCeil(monthsToDays(months) + days) * 864e5;\par
            days = 0;\par
            months = 0;\par
        \}\par
\par
        // The following code bubbles up values, see the tests for\par
        // examples of what that means.\par
        data.milliseconds = milliseconds % 1000;\par
\par
        seconds = absFloor(milliseconds / 1000);\par
        data.seconds = seconds % 60;\par
\par
        minutes = absFloor(seconds / 60);\par
        data.minutes = minutes % 60;\par
\par
        hours = absFloor(minutes / 60);\par
        data.hours = hours % 24;\par
\par
        days += absFloor(hours / 24);\par
\par
        // convert days to months\par
        monthsFromDays = absFloor(daysToMonths(days));\par
        months += monthsFromDays;\par
        days -= absCeil(monthsToDays(monthsFromDays));\par
\par
        // 12 months -> 1 year\par
        years = absFloor(months / 12);\par
        months %= 12;\par
\par
        data.days = days;\par
        data.months = months;\par
        data.years = years;\par
\par
        return this;\par
    \}\par
\par
    function daysToMonths(days) \{\par
        // 400 years have 146097 days (taking into account leap year rules)\par
        // 400 years have 12 months === 4800\par
        return (days * 4800) / 146097;\par
    \}\par
\par
    function monthsToDays(months) \{\par
        // the reverse of daysToMonths\par
        return (months * 146097) / 4800;\par
    \}\par
\par
    function as(units) \{\par
        if (!this.isValid()) \{\par
            return NaN;\par
        \}\par
        var days,\par
            months,\par
            milliseconds = this._milliseconds;\par
\par
        units = normalizeUnits(units);\par
\par
        if (units === 'month' || units === 'quarter' || units === 'year') \{\par
            days = this._days + milliseconds / 864e5;\par
            months = this._months + daysToMonths(days);\par
            switch (units) \{\par
                case 'month':\par
                    return months;\par
                case 'quarter':\par
                    return months / 3;\par
                case 'year':\par
                    return months / 12;\par
            \}\par
        \} else \{\par
            // handle milliseconds separately because of floating point math errors (issue #1867)\par
            days = this._days + Math.round(monthsToDays(this._months));\par
            switch (units) \{\par
                case 'week':\par
                    return days / 7 + milliseconds / 6048e5;\par
                case 'day':\par
                    return days + milliseconds / 864e5;\par
                case 'hour':\par
                    return days * 24 + milliseconds / 36e5;\par
                case 'minute':\par
                    return days * 1440 + milliseconds / 6e4;\par
                case 'second':\par
                    return days * 86400 + milliseconds / 1000;\par
                // Math.floor prevents floating point math errors here\par
                case 'millisecond':\par
                    return Math.floor(days * 864e5) + milliseconds;\par
                default:\par
                    throw new Error('Unknown unit ' + units);\par
            \}\par
        \}\par
    \}\par
\par
    function makeAs(alias) \{\par
        return function () \{\par
            return this.as(alias);\par
        \};\par
    \}\par
\par
    var asMilliseconds = makeAs('ms'),\par
        asSeconds = makeAs('s'),\par
        asMinutes = makeAs('m'),\par
        asHours = makeAs('h'),\par
        asDays = makeAs('d'),\par
        asWeeks = makeAs('w'),\par
        asMonths = makeAs('M'),\par
        asQuarters = makeAs('Q'),\par
        asYears = makeAs('y'),\par
        valueOf$1 = asMilliseconds;\par
\par
    function clone$1() \{\par
        return createDuration(this);\par
    \}\par
\par
    function get$2(units) \{\par
        units = normalizeUnits(units);\par
        return this.isValid() ? this[units + 's']() : NaN;\par
    \}\par
\par
    function makeGetter(name) \{\par
        return function () \{\par
            return this.isValid() ? this._data[name] : NaN;\par
        \};\par
    \}\par
\par
    var milliseconds = makeGetter('milliseconds'),\par
        seconds = makeGetter('seconds'),\par
        minutes = makeGetter('minutes'),\par
        hours = makeGetter('hours'),\par
        days = makeGetter('days'),\par
        months = makeGetter('months'),\par
        years = makeGetter('years');\par
\par
    function weeks() \{\par
        return absFloor(this.days() / 7);\par
    \}\par
\par
    var round = Math.round,\par
        thresholds = \{\par
            ss: 44, // a few seconds to seconds\par
            s: 45, // seconds to minute\par
            m: 45, // minutes to hour\par
            h: 22, // hours to day\par
            d: 26, // days to month/week\par
            w: null, // weeks to month\par
            M: 11, // months to year\par
        \};\par
\par
    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize\par
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) \{\par
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);\par
    \}\par
\par
    function relativeTime$1(posNegDuration, withoutSuffix, thresholds, locale) \{\par
        var duration = createDuration(posNegDuration).abs(),\par
            seconds = round(duration.as('s')),\par
            minutes = round(duration.as('m')),\par
            hours = round(duration.as('h')),\par
            days = round(duration.as('d')),\par
            months = round(duration.as('M')),\par
            weeks = round(duration.as('w')),\par
            years = round(duration.as('y')),\par
            a =\par
                (seconds <= thresholds.ss && ['s', seconds]) ||\par
                (seconds < thresholds.s && ['ss', seconds]) ||\par
                (minutes <= 1 && ['m']) ||\par
                (minutes < thresholds.m && ['mm', minutes]) ||\par
                (hours <= 1 && ['h']) ||\par
                (hours < thresholds.h && ['hh', hours]) ||\par
                (days <= 1 && ['d']) ||\par
                (days < thresholds.d && ['dd', days]);\par
\par
        if (thresholds.w != null) \{\par
            a =\par
                a ||\par
                (weeks <= 1 && ['w']) ||\par
                (weeks < thresholds.w && ['ww', weeks]);\par
        \}\par
        a = a ||\par
            (months <= 1 && ['M']) ||\par
            (months < thresholds.M && ['MM', months]) ||\par
            (years <= 1 && ['y']) || ['yy', years];\par
\par
        a[2] = withoutSuffix;\par
        a[3] = +posNegDuration > 0;\par
        a[4] = locale;\par
        return substituteTimeAgo.apply(null, a);\par
    \}\par
\par
    // This function allows you to set the rounding function for relative time strings\par
    function getSetRelativeTimeRounding(roundingFunction) \{\par
        if (roundingFunction === undefined) \{\par
            return round;\par
        \}\par
        if (typeof roundingFunction === 'function') \{\par
            round = roundingFunction;\par
            return true;\par
        \}\par
        return false;\par
    \}\par
\par
    // This function allows you to set a threshold for relative time strings\par
    function getSetRelativeTimeThreshold(threshold, limit) \{\par
        if (thresholds[threshold] === undefined) \{\par
            return false;\par
        \}\par
        if (limit === undefined) \{\par
            return thresholds[threshold];\par
        \}\par
        thresholds[threshold] = limit;\par
        if (threshold === 's') \{\par
            thresholds.ss = limit - 1;\par
        \}\par
        return true;\par
    \}\par
\par
    function humanize(argWithSuffix, argThresholds) \{\par
        if (!this.isValid()) \{\par
            return this.localeData().invalidDate();\par
        \}\par
\par
        var withSuffix = false,\par
            th = thresholds,\par
            locale,\par
            output;\par
\par
        if (typeof argWithSuffix === 'object') \{\par
            argThresholds = argWithSuffix;\par
            argWithSuffix = false;\par
        \}\par
        if (typeof argWithSuffix === 'boolean') \{\par
            withSuffix = argWithSuffix;\par
        \}\par
        if (typeof argThresholds === 'object') \{\par
            th = Object.assign(\{\}, thresholds, argThresholds);\par
            if (argThresholds.s != null && argThresholds.ss == null) \{\par
                th.ss = argThresholds.s - 1;\par
            \}\par
        \}\par
\par
        locale = this.localeData();\par
        output = relativeTime$1(this, !withSuffix, th, locale);\par
\par
        if (withSuffix) \{\par
            output = locale.pastFuture(+this, output);\par
        \}\par
\par
        return locale.postformat(output);\par
    \}\par
\par
    var abs$1 = Math.abs;\par
\par
    function sign(x) \{\par
        return (x > 0) - (x < 0) || +x;\par
    \}\par
\par
    function toISOString$1() \{\par
        // for ISO strings we do not use the normal bubbling rules:\par
        //  * milliseconds bubble up until they become hours\par
        //  * days do not bubble at all\par
        //  * months bubble up until they become years\par
        // This is because there is no context-free conversion between hours and days\par
        // (think of clock changes)\par
        // and also not between days and months (28-31 days per month)\par
        if (!this.isValid()) \{\par
            return this.localeData().invalidDate();\par
        \}\par
\par
        var seconds = abs$1(this._milliseconds) / 1000,\par
            days = abs$1(this._days),\par
            months = abs$1(this._months),\par
            minutes,\par
            hours,\par
            years,\par
            s,\par
            total = this.asSeconds(),\par
            totalSign,\par
            ymSign,\par
            daysSign,\par
            hmsSign;\par
\par
        if (!total) \{\par
            // this is the same as C#'s (Noda) and python (isodate)...\par
            // but not other JS (goog.date)\par
            return 'P0D';\par
        \}\par
\par
        // 3600 seconds -> 60 minutes -> 1 hour\par
        minutes = absFloor(seconds / 60);\par
        hours = absFloor(minutes / 60);\par
        seconds %= 60;\par
        minutes %= 60;\par
\par
        // 12 months -> 1 year\par
        years = absFloor(months / 12);\par
        months %= 12;\par
\par
        // inspired by {{\field{\*\fldinst{HYPERLINK https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js }}{\fldrslt{https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js\ul0\cf0}}}}\f0\fs22\par
        s = seconds ? seconds.toFixed(3).replace(/\\.?0+$/, '') : '';\par
\par
        totalSign = total < 0 ? '-' : '';\par
        ymSign = sign(this._months) !== sign(total) ? '-' : '';\par
        daysSign = sign(this._days) !== sign(total) ? '-' : '';\par
        hmsSign = sign(this._milliseconds) !== sign(total) ? '-' : '';\par
\par
        return (\par
            totalSign +\par
            'P' +\par
            (years ? ymSign + years + 'Y' : '') +\par
            (months ? ymSign + months + 'M' : '') +\par
            (days ? daysSign + days + 'D' : '') +\par
            (hours || minutes || seconds ? 'T' : '') +\par
            (hours ? hmsSign + hours + 'H' : '') +\par
            (minutes ? hmsSign + minutes + 'M' : '') +\par
            (seconds ? hmsSign + s + 'S' : '')\par
        );\par
    \}\par
\par
    var proto$2 = Duration.prototype;\par
\par
    proto$2.isValid = isValid$1;\par
    proto$2.abs = abs;\par
    proto$2.add = add$1;\par
    proto$2.subtract = subtract$1;\par
    proto$2.as = as;\par
    proto$2.asMilliseconds = asMilliseconds;\par
    proto$2.asSeconds = asSeconds;\par
    proto$2.asMinutes = asMinutes;\par
    proto$2.asHours = asHours;\par
    proto$2.asDays = asDays;\par
    proto$2.asWeeks = asWeeks;\par
    proto$2.asMonths = asMonths;\par
    proto$2.asQuarters = asQuarters;\par
    proto$2.asYears = asYears;\par
    proto$2.valueOf = valueOf$1;\par
    proto$2._bubble = bubble;\par
    proto$2.clone = clone$1;\par
    proto$2.get = get$2;\par
    proto$2.milliseconds = milliseconds;\par
    proto$2.seconds = seconds;\par
    proto$2.minutes = minutes;\par
    proto$2.hours = hours;\par
    proto$2.days = days;\par
    proto$2.weeks = weeks;\par
    proto$2.months = months;\par
    proto$2.years = years;\par
    proto$2.humanize = humanize;\par
    proto$2.toISOString = toISOString$1;\par
    proto$2.toString = toISOString$1;\par
    proto$2.toJSON = toISOString$1;\par
    proto$2.locale = locale;\par
    proto$2.localeData = localeData;\par
\par
    proto$2.toIsoString = deprecate(\par
        'toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)',\par
        toISOString$1\par
    );\par
    proto$2.lang = lang;\par
\par
    // FORMATTING\par
\par
    addFormatToken('X', 0, 0, 'unix');\par
    addFormatToken('x', 0, 0, 'valueOf');\par
\par
    // PARSING\par
\par
    addRegexToken('x', matchSigned);\par
    addRegexToken('X', matchTimestamp);\par
    addParseToken('X', function (input, array, config) \{\par
        config._d = new Date(parseFloat(input) * 1000);\par
    \});\par
    addParseToken('x', function (input, array, config) \{\par
        config._d = new Date(toInt(input));\par
    \});\par
\par
    //! moment.js\par
\par
    hooks.version = '2.30.1';\par
\par
    setHookCallback(createLocal);\par
\par
    hooks.fn = proto;\par
    hooks.min = min;\par
    hooks.max = max;\par
    hooks.now = now;\par
    hooks.utc = createUTC;\par
    hooks.unix = createUnix;\par
    hooks.months = listMonths;\par
    hooks.isDate = isDate;\par
    hooks.locale = getSetGlobalLocale;\par
    hooks.invalid = createInvalid;\par
    hooks.duration = createDuration;\par
    hooks.isMoment = isMoment;\par
    hooks.weekdays = listWeekdays;\par
    hooks.parseZone = createInZone;\par
    hooks.localeData = getLocale;\par
    hooks.isDuration = isDuration;\par
    hooks.monthsShort = listMonthsShort;\par
    hooks.weekdaysMin = listWeekdaysMin;\par
    hooks.defineLocale = defineLocale;\par
    hooks.updateLocale = updateLocale;\par
    hooks.locales = listLocales;\par
    hooks.weekdaysShort = listWeekdaysShort;\par
    hooks.normalizeUnits = normalizeUnits;\par
    hooks.relativeTimeRounding = getSetRelativeTimeRounding;\par
    hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;\par
    hooks.calendarFormat = getCalendarFormat;\par
    hooks.prototype = proto;\par
\par
    // currently HTML5 input type only supports 24-hour formats\par
    hooks.HTML5_FMT = \{\par
        DATETIME_LOCAL: 'YYYY-MM-DDTHH:mm', // <input type="datetime-local" />\par
        DATETIME_LOCAL_SECONDS: 'YYYY-MM-DDTHH:mm:ss', // <input type="datetime-local" step="1" />\par
        DATETIME_LOCAL_MS: 'YYYY-MM-DDTHH:mm:ss.SSS', // <input type="datetime-local" step="0.001" />\par
        DATE: 'YYYY-MM-DD', // <input type="date" />\par
        TIME: 'HH:mm', // <input type="time" />\par
        TIME_SECONDS: 'HH:mm:ss', // <input type="time" step="1" />\par
        TIME_MS: 'HH:mm:ss.SSS', // <input type="time" step="0.001" />\par
        WEEK: 'GGGG-[W]WW', // <input type="week" />\par
        MONTH: 'YYYY-MM', // <input type="month" />\par
    \};\par
\par
    return hooks;\par
\par
\})));\par
}
 
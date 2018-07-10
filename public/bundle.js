var hw = (function (exports) {
    'use strict';

    /*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
    /* global Reflect, Promise */
    var extendStatics = Object.setPrototypeOf ||
        ({__proto__: []} instanceof Array && function (d, b) {
            d.__proto__ = b;
        }) ||
        function (d, b) {
            for (var p in b)
                if (b.hasOwnProperty(p))
                    d[p] = b[p];
        };

    function __extends(d, b) {
        extendStatics(d, b);

        function __() {
            this.constructor = d;
        }

        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s)
                if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
        }
        return t;
    };

// CommonJS / Node have global context exposed as "global" variable.
// We don't want to include the whole node.d.ts this this compilation unit so we'll just fake
// the global "global" var for now.
    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    var __window = typeof window !== 'undefined' && window;
    var __self = typeof self !== 'undefined' && typeof WorkerGlobalScope !== 'undefined' &&
        self instanceof WorkerGlobalScope && self;
    var __global = typeof global !== 'undefined' && global;
    var _root = __window || __global || __self;
// Workaround Closure Compiler restriction: The body of a goog.module cannot use throw.
// This is needed when used with angular/tsickle which inserts a goog.module statement.
// Wrap in IIFE
    /*@__PURE__*/
    (function () {
        if (!_root) {
            throw new Error('RxJS could not find any global context (window, self, global)');
        }
    })();

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    function isFunction(x) {
        return typeof x === 'function';
    }

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    var isArray = Array.isArray || (function (x) {
        return x && typeof x.length === 'number';
    });

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    function isObject(x) {
        return x != null && typeof x === 'object';
    }

// typeof any so that it we don't have to cast when comparing a result to the error object
    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    var errorObject = {e: {}};

    /** PURE_IMPORTS_START ._errorObject PURE_IMPORTS_END */
    var tryCatchTarget;

    function tryCatcher() {
        try {
            return tryCatchTarget.apply(this, arguments);
        }
        catch (e) {
            errorObject.e = e;
            return errorObject;
        }
    }

    function tryCatch(fn) {
        tryCatchTarget = fn;
        return tryCatcher;
    }

    /**
     * An error thrown when one or more errors have occurred during the
     * `unsubscribe` of a {@link Subscription}.
     */
    var UnsubscriptionError = /*@__PURE__*/ (function (_super) {
        __extends(UnsubscriptionError, _super);

        function UnsubscriptionError(errors) {
            _super.call(this);
            this.errors = errors;
            var err = Error.call(this, errors ?
                errors.length + " errors occurred during unsubscription:\n  " + errors.map(function (err, i) {
                    return ((i + 1) + ") " + err.toString());
                }).join('\n  ') : '');
            this.name = err.name = 'UnsubscriptionError';
            this.stack = err.stack;
            this.message = err.message;
        }

        return UnsubscriptionError;
    }(Error));

    /** PURE_IMPORTS_START ._util_isArray,._util_isObject,._util_isFunction,._util_tryCatch,._util_errorObject,._util_UnsubscriptionError PURE_IMPORTS_END */
    /**
     * Represents a disposable resource, such as the execution of an Observable. A
     * Subscription has one important method, `unsubscribe`, that takes no argument
     * and just disposes the resource held by the subscription.
     *
     * Additionally, subscriptions may be grouped together through the `add()`
     * method, which will attach a child Subscription to the current Subscription.
     * When a Subscription is unsubscribed, all its children (and its grandchildren)
     * will be unsubscribed as well.
     *
     * @class Subscription
     */
    var Subscription = /*@__PURE__*/ (function () {
        /**
         * @param {function(): void} [unsubscribe] A function describing how to
         * perform the disposal of resources when the `unsubscribe` method is called.
         */
        function Subscription(unsubscribe) {
            /**
             * A flag to indicate whether this Subscription has already been unsubscribed.
             * @type {boolean}
             */
            this.closed = false;
            this._parent = null;
            this._parents = null;
            this._subscriptions = null;
            if (unsubscribe) {
                this._unsubscribe = unsubscribe;
            }
        }

        /**
         * Disposes the resources held by the subscription. May, for instance, cancel
         * an ongoing Observable execution or cancel any other type of work that
         * started when the Subscription was created.
         * @return {void}
         */
        Subscription.prototype.unsubscribe = function () {
            var hasErrors = false;
            var errors;
            if (this.closed) {
                return;
            }
            var _a = this, _parent = _a._parent, _parents = _a._parents, _unsubscribe = _a._unsubscribe,
                _subscriptions = _a._subscriptions;
            this.closed = true;
            this._parent = null;
            this._parents = null;
            // null out _subscriptions first so any child subscriptions that attempt
            // to remove themselves from this subscription will noop
            this._subscriptions = null;
            var index = -1;
            var len = _parents ? _parents.length : 0;
            // if this._parent is null, then so is this._parents, and we
            // don't have to remove ourselves from any parent subscriptions.
            while (_parent) {
                _parent.remove(this);
                // if this._parents is null or index >= len,
                // then _parent is set to null, and the loop exits
                _parent = ++index < len && _parents[index] || null;
            }
            if (isFunction(_unsubscribe)) {
                var trial = tryCatch(_unsubscribe).call(this);
                if (trial === errorObject) {
                    hasErrors = true;
                    errors = errors || (errorObject.e instanceof UnsubscriptionError ?
                        flattenUnsubscriptionErrors(errorObject.e.errors) : [errorObject.e]);
                }
            }
            if (isArray(_subscriptions)) {
                index = -1;
                len = _subscriptions.length;
                while (++index < len) {
                    var sub = _subscriptions[index];
                    if (isObject(sub)) {
                        var trial = tryCatch(sub.unsubscribe).call(sub);
                        if (trial === errorObject) {
                            hasErrors = true;
                            errors = errors || [];
                            var err = errorObject.e;
                            if (err instanceof UnsubscriptionError) {
                                errors = errors.concat(flattenUnsubscriptionErrors(err.errors));
                            }
                            else {
                                errors.push(err);
                            }
                        }
                    }
                }
            }
            if (hasErrors) {
                throw new UnsubscriptionError(errors);
            }
        };
        /**
         * Adds a tear down to be called during the unsubscribe() of this
         * Subscription.
         *
         * If the tear down being added is a subscription that is already
         * unsubscribed, is the same reference `add` is being called on, or is
         * `Subscription.EMPTY`, it will not be added.
         *
         * If this subscription is already in an `closed` state, the passed
         * tear down logic will be executed immediately.
         *
         * @param {TeardownLogic} teardown The additional logic to execute on
         * teardown.
         * @return {Subscription} Returns the Subscription used or created to be
         * added to the inner subscriptions list. This Subscription can be used with
         * `remove()` to remove the passed teardown logic from the inner subscriptions
         * list.
         */
        Subscription.prototype.add = function (teardown) {
            if (!teardown || (teardown === Subscription.EMPTY)) {
                return Subscription.EMPTY;
            }
            if (teardown === this) {
                return this;
            }
            var subscription = teardown;
            switch (typeof teardown) {
                case 'function':
                    subscription = new Subscription(teardown);
                case 'object':
                    if (subscription.closed || typeof subscription.unsubscribe !== 'function') {
                        return subscription;
                    }
                    else if (this.closed) {
                        subscription.unsubscribe();
                        return subscription;
                    }
                    else if (typeof subscription._addParent !== 'function' /* quack quack */) {
                        var tmp = subscription;
                        subscription = new Subscription();
                        subscription._subscriptions = [tmp];
                    }
                    break;
                default:
                    throw new Error('unrecognized teardown ' + teardown + ' added to Subscription.');
            }
            var subscriptions = this._subscriptions || (this._subscriptions = []);
            subscriptions.push(subscription);
            subscription._addParent(this);
            return subscription;
        };
        /**
         * Removes a Subscription from the internal list of subscriptions that will
         * unsubscribe during the unsubscribe process of this Subscription.
         * @param {Subscription} subscription The subscription to remove.
         * @return {void}
         */
        Subscription.prototype.remove = function (subscription) {
            var subscriptions = this._subscriptions;
            if (subscriptions) {
                var subscriptionIndex = subscriptions.indexOf(subscription);
                if (subscriptionIndex !== -1) {
                    subscriptions.splice(subscriptionIndex, 1);
                }
            }
        };
        Subscription.prototype._addParent = function (parent) {
            var _a = this, _parent = _a._parent, _parents = _a._parents;
            if (!_parent || _parent === parent) {
                // If we don't have a parent, or the new parent is the same as the
                // current parent, then set this._parent to the new parent.
                this._parent = parent;
            }
            else if (!_parents) {
                // If there's already one parent, but not multiple, allocate an Array to
                // store the rest of the parent Subscriptions.
                this._parents = [parent];
            }
            else if (_parents.indexOf(parent) === -1) {
                // Only add the new parent to the _parents list if it's not already there.
                _parents.push(parent);
            }
        };
        Subscription.EMPTY = (function (empty) {
            empty.closed = true;
            return empty;
        }(new Subscription()));
        return Subscription;
    }());

    function flattenUnsubscriptionErrors(errors) {
        return errors.reduce(function (errs, err) {
            return errs.concat((err instanceof UnsubscriptionError) ? err.errors : err);
        }, []);
    }

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    var empty = {
        closed: true,
        next: function (value) {
        },
        error: function (err) {
            throw err;
        },
        complete: function () {
        }
    };

    /** PURE_IMPORTS_START .._util_root PURE_IMPORTS_END */
    var Symbol$1 = _root.Symbol;
    var rxSubscriber = (typeof Symbol$1 === 'function' && typeof Symbol$1.for === 'function') ?
        /*@__PURE__*/ Symbol$1.for('rxSubscriber') : '@@rxSubscriber';
    /**
     * @deprecated use rxSubscriber instead
     */

    /**
     * Implements the {@link Observer} interface and extends the
     * {@link Subscription} class. While the {@link Observer} is the public API for
     * consuming the values of an {@link Observable}, all Observers get converted to
     * a Subscriber, in order to provide Subscription-like capabilities such as
     * `unsubscribe`. Subscriber is a common type in RxJS, and crucial for
     * implementing operators, but it is rarely used as a public API.
     *
     * @class Subscriber<T>
     */
    var Subscriber = /*@__PURE__*/ (function (_super) {
        __extends(Subscriber, _super);

        /**
         * @param {Observer|function(value: T): void} [destinationOrNext] A partially
         * defined Observer or a `next` callback function.
         * @param {function(e: ?any): void} [error] The `error` callback of an
         * Observer.
         * @param {function(): void} [complete] The `complete` callback of an
         * Observer.
         */
        function Subscriber(destinationOrNext, error, complete) {
            _super.call(this);
            this.syncErrorValue = null;
            this.syncErrorThrown = false;
            this.syncErrorThrowable = false;
            this.isStopped = false;
            switch (arguments.length) {
                case 0:
                    this.destination = empty;
                    break;
                case 1:
                    if (!destinationOrNext) {
                        this.destination = empty;
                        break;
                    }
                    if (typeof destinationOrNext === 'object') {
                        if (destinationOrNext instanceof Subscriber) {
                            this.syncErrorThrowable = destinationOrNext.syncErrorThrowable;
                            this.destination = destinationOrNext;
                            this.destination.add(this);
                        }
                        else {
                            this.syncErrorThrowable = true;
                            this.destination = new SafeSubscriber(this, destinationOrNext);
                        }
                        break;
                    }
                default:
                    this.syncErrorThrowable = true;
                    this.destination = new SafeSubscriber(this, destinationOrNext, error, complete);
                    break;
            }
        }

        Subscriber.prototype[rxSubscriber] = function () {
            return this;
        };
        /**
         * A static factory for a Subscriber, given a (potentially partial) definition
         * of an Observer.
         * @param {function(x: ?T): void} [next] The `next` callback of an Observer.
         * @param {function(e: ?any): void} [error] The `error` callback of an
         * Observer.
         * @param {function(): void} [complete] The `complete` callback of an
         * Observer.
         * @return {Subscriber<T>} A Subscriber wrapping the (partially defined)
         * Observer represented by the given arguments.
         */
        Subscriber.create = function (next, error, complete) {
            var subscriber = new Subscriber(next, error, complete);
            subscriber.syncErrorThrowable = false;
            return subscriber;
        };
        /**
         * The {@link Observer} callback to receive notifications of type `next` from
         * the Observable, with a value. The Observable may call this method 0 or more
         * times.
         * @param {T} [value] The `next` value.
         * @return {void}
         */
        Subscriber.prototype.next = function (value) {
            if (!this.isStopped) {
                this._next(value);
            }
        };
        /**
         * The {@link Observer} callback to receive notifications of type `error` from
         * the Observable, with an attached {@link Error}. Notifies the Observer that
         * the Observable has experienced an error condition.
         * @param {any} [err] The `error` exception.
         * @return {void}
         */
        Subscriber.prototype.error = function (err) {
            if (!this.isStopped) {
                this.isStopped = true;
                this._error(err);
            }
        };
        /**
         * The {@link Observer} callback to receive a valueless notification of type
         * `complete` from the Observable. Notifies the Observer that the Observable
         * has finished sending push-based notifications.
         * @return {void}
         */
        Subscriber.prototype.complete = function () {
            if (!this.isStopped) {
                this.isStopped = true;
                this._complete();
            }
        };
        Subscriber.prototype.unsubscribe = function () {
            if (this.closed) {
                return;
            }
            this.isStopped = true;
            _super.prototype.unsubscribe.call(this);
        };
        Subscriber.prototype._next = function (value) {
            this.destination.next(value);
        };
        Subscriber.prototype._error = function (err) {
            this.destination.error(err);
            this.unsubscribe();
        };
        Subscriber.prototype._complete = function () {
            this.destination.complete();
            this.unsubscribe();
        };
        Subscriber.prototype._unsubscribeAndRecycle = function () {
            var _a = this, _parent = _a._parent, _parents = _a._parents;
            this._parent = null;
            this._parents = null;
            this.unsubscribe();
            this.closed = false;
            this.isStopped = false;
            this._parent = _parent;
            this._parents = _parents;
            return this;
        };
        return Subscriber;
    }(Subscription));
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @ignore
     * @extends {Ignored}
     */
    var SafeSubscriber = /*@__PURE__*/ (function (_super) {
        __extends(SafeSubscriber, _super);

        function SafeSubscriber(_parentSubscriber, observerOrNext, error, complete) {
            _super.call(this);
            this._parentSubscriber = _parentSubscriber;
            var next;
            var context = this;
            if (isFunction(observerOrNext)) {
                next = observerOrNext;
            }
            else if (observerOrNext) {
                next = observerOrNext.next;
                error = observerOrNext.error;
                complete = observerOrNext.complete;
                if (observerOrNext !== empty) {
                    context = Object.create(observerOrNext);
                    if (isFunction(context.unsubscribe)) {
                        this.add(context.unsubscribe.bind(context));
                    }
                    context.unsubscribe = this.unsubscribe.bind(this);
                }
            }
            this._context = context;
            this._next = next;
            this._error = error;
            this._complete = complete;
        }

        SafeSubscriber.prototype.next = function (value) {
            if (!this.isStopped && this._next) {
                var _parentSubscriber = this._parentSubscriber;
                if (!_parentSubscriber.syncErrorThrowable) {
                    this.__tryOrUnsub(this._next, value);
                }
                else if (this.__tryOrSetError(_parentSubscriber, this._next, value)) {
                    this.unsubscribe();
                }
            }
        };
        SafeSubscriber.prototype.error = function (err) {
            if (!this.isStopped) {
                var _parentSubscriber = this._parentSubscriber;
                if (this._error) {
                    if (!_parentSubscriber.syncErrorThrowable) {
                        this.__tryOrUnsub(this._error, err);
                        this.unsubscribe();
                    }
                    else {
                        this.__tryOrSetError(_parentSubscriber, this._error, err);
                        this.unsubscribe();
                    }
                }
                else if (!_parentSubscriber.syncErrorThrowable) {
                    this.unsubscribe();
                    throw err;
                }
                else {
                    _parentSubscriber.syncErrorValue = err;
                    _parentSubscriber.syncErrorThrown = true;
                    this.unsubscribe();
                }
            }
        };
        SafeSubscriber.prototype.complete = function () {
            var _this = this;
            if (!this.isStopped) {
                var _parentSubscriber = this._parentSubscriber;
                if (this._complete) {
                    var wrappedComplete = function () {
                        return _this._complete.call(_this._context);
                    };
                    if (!_parentSubscriber.syncErrorThrowable) {
                        this.__tryOrUnsub(wrappedComplete);
                        this.unsubscribe();
                    }
                    else {
                        this.__tryOrSetError(_parentSubscriber, wrappedComplete);
                        this.unsubscribe();
                    }
                }
                else {
                    this.unsubscribe();
                }
            }
        };
        SafeSubscriber.prototype.__tryOrUnsub = function (fn, value) {
            try {
                fn.call(this._context, value);
            }
            catch (err) {
                this.unsubscribe();
                throw err;
            }
        };
        SafeSubscriber.prototype.__tryOrSetError = function (parent, fn, value) {
            try {
                fn.call(this._context, value);
            }
            catch (err) {
                parent.syncErrorValue = err;
                parent.syncErrorThrown = true;
                return true;
            }
            return false;
        };
        SafeSubscriber.prototype._unsubscribe = function () {
            var _parentSubscriber = this._parentSubscriber;
            this._context = null;
            this._parentSubscriber = null;
            _parentSubscriber.unsubscribe();
        };
        return SafeSubscriber;
    }(Subscriber));

    /** PURE_IMPORTS_START .._Subscriber,.._symbol_rxSubscriber,.._Observer PURE_IMPORTS_END */
    function toSubscriber(nextOrObserver, error, complete) {
        if (nextOrObserver) {
            if (nextOrObserver instanceof Subscriber) {
                return nextOrObserver;
            }
            if (nextOrObserver[rxSubscriber]) {
                return nextOrObserver[rxSubscriber]();
            }
        }
        if (!nextOrObserver && !error && !complete) {
            return new Subscriber(empty);
        }
        return new Subscriber(nextOrObserver, error, complete);
    }

    /** PURE_IMPORTS_START .._util_root PURE_IMPORTS_END */
    function getSymbolObservable(context) {
        var $$observable;
        var Symbol = context.Symbol;
        if (typeof Symbol === 'function') {
            if (Symbol.observable) {
                $$observable = Symbol.observable;
            }
            else {
                $$observable = Symbol('observable');
                Symbol.observable = $$observable;
            }
        }
        else {
            $$observable = '@@observable';
        }
        return $$observable;
    }

    var observable = /*@__PURE__*/ getSymbolObservable(_root);
    /**
     * @deprecated use observable instead
     */

    /* tslint:disable:no-empty */
    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    function noop() {
    }

    /** PURE_IMPORTS_START ._noop PURE_IMPORTS_END */
    /* tslint:enable:max-line-length */

    /* @internal */
    function pipeFromArray(fns) {
        if (!fns) {
            return noop;
        }
        if (fns.length === 1) {
            return fns[0];
        }
        return function piped(input) {
            return fns.reduce(function (prev, fn) {
                return fn(prev);
            }, input);
        };
    }

    /** PURE_IMPORTS_START ._util_root,._util_toSubscriber,._symbol_observable,._util_pipe PURE_IMPORTS_END */
    /**
     * A representation of any set of values over any amount of time. This is the most basic building block
     * of RxJS.
     *
     * @class Observable<T>
     */
    var Observable = /*@__PURE__*/ (function () {
        /**
         * @constructor
         * @param {Function} subscribe the function that is called when the Observable is
         * initially subscribed to. This function is given a Subscriber, to which new values
         * can be `next`ed, or an `error` method can be called to raise an error, or
         * `complete` can be called to notify of a successful completion.
         */
        function Observable(subscribe) {
            this._isScalar = false;
            if (subscribe) {
                this._subscribe = subscribe;
            }
        }

        /**
         * Creates a new Observable, with this Observable as the source, and the passed
         * operator defined as the new observable's operator.
         * @method lift
         * @param {Operator} operator the operator defining the operation to take on the observable
         * @return {Observable} a new observable with the Operator applied
         */
        Observable.prototype.lift = function (operator) {
            var observable$$1 = new Observable();
            observable$$1.source = this;
            observable$$1.operator = operator;
            return observable$$1;
        };
        /**
         * Invokes an execution of an Observable and registers Observer handlers for notifications it will emit.
         *
         * <span class="informal">Use it when you have all these Observables, but still nothing is happening.</span>
         *
         * `subscribe` is not a regular operator, but a method that calls Observable's internal `subscribe` function. It
         * might be for example a function that you passed to a {@link create} static factory, but most of the time it is
         * a library implementation, which defines what and when will be emitted by an Observable. This means that calling
         * `subscribe` is actually the moment when Observable starts its work, not when it is created, as it is often
         * thought.
         *
         * Apart from starting the execution of an Observable, this method allows you to listen for values
         * that an Observable emits, as well as for when it completes or errors. You can achieve this in two
         * following ways.
         *
         * The first way is creating an object that implements {@link Observer} interface. It should have methods
         * defined by that interface, but note that it should be just a regular JavaScript object, which you can create
         * yourself in any way you want (ES6 class, classic function constructor, object literal etc.). In particular do
         * not attempt to use any RxJS implementation details to create Observers - you don't need them. Remember also
         * that your object does not have to implement all methods. If you find yourself creating a method that doesn't
         * do anything, you can simply omit it. Note however, that if `error` method is not provided, all errors will
         * be left uncaught.
         *
         * The second way is to give up on Observer object altogether and simply provide callback functions in place of its methods.
         * This means you can provide three functions as arguments to `subscribe`, where first function is equivalent
         * of a `next` method, second of an `error` method and third of a `complete` method. Just as in case of Observer,
         * if you do not need to listen for something, you can omit a function, preferably by passing `undefined` or `null`,
         * since `subscribe` recognizes these functions by where they were placed in function call. When it comes
         * to `error` function, just as before, if not provided, errors emitted by an Observable will be thrown.
         *
         * Whatever style of calling `subscribe` you use, in both cases it returns a Subscription object.
         * This object allows you to call `unsubscribe` on it, which in turn will stop work that an Observable does and will clean
         * up all resources that an Observable used. Note that cancelling a subscription will not call `complete` callback
         * provided to `subscribe` function, which is reserved for a regular completion signal that comes from an Observable.
         *
         * Remember that callbacks provided to `subscribe` are not guaranteed to be called asynchronously.
         * It is an Observable itself that decides when these functions will be called. For example {@link of}
         * by default emits all its values synchronously. Always check documentation for how given Observable
         * will behave when subscribed and if its default behavior can be modified with a {@link Scheduler}.
         *
         * @example <caption>Subscribe with an Observer</caption>
         * const sumObserver = {
         *   sum: 0,
         *   next(value) {
         *     console.log('Adding: ' + value);
         *     this.sum = this.sum + value;
         *   },
         *   error() { // We actually could just remove this method,
         *   },        // since we do not really care about errors right now.
         *   complete() {
         *     console.log('Sum equals: ' + this.sum);
         *   }
         * };
         *
         * Rx.Observable.of(1, 2, 3) // Synchronously emits 1, 2, 3 and then completes.
         * .subscribe(sumObserver);
         *
         * // Logs:
         * // "Adding: 1"
         * // "Adding: 2"
         * // "Adding: 3"
         * // "Sum equals: 6"
         *
         *
         * @example <caption>Subscribe with functions</caption>
         * let sum = 0;
         *
         * Rx.Observable.of(1, 2, 3)
         * .subscribe(
         *   function(value) {
         *     console.log('Adding: ' + value);
         *     sum = sum + value;
         *   },
         *   undefined,
         *   function() {
         *     console.log('Sum equals: ' + sum);
         *   }
         * );
         *
         * // Logs:
         * // "Adding: 1"
         * // "Adding: 2"
         * // "Adding: 3"
         * // "Sum equals: 6"
         *
         *
         * @example <caption>Cancel a subscription</caption>
         * const subscription = Rx.Observable.interval(1000).subscribe(
         *   num => console.log(num),
         *   undefined,
         *   () => console.log('completed!') // Will not be called, even
         * );                                // when cancelling subscription
         *
         *
         * setTimeout(() => {
         *   subscription.unsubscribe();
         *   console.log('unsubscribed!');
         * }, 2500);
         *
         * // Logs:
         * // 0 after 1s
         * // 1 after 2s
         * // "unsubscribed!" after 2.5s
         *
         *
         * @param {Observer|Function} observerOrNext (optional) Either an observer with methods to be called,
         *  or the first of three possible handlers, which is the handler for each value emitted from the subscribed
         *  Observable.
         * @param {Function} error (optional) A handler for a terminal event resulting from an error. If no error handler is provided,
         *  the error will be thrown as unhandled.
         * @param {Function} complete (optional) A handler for a terminal event resulting from successful completion.
         * @return {ISubscription} a subscription reference to the registered handlers
         * @method subscribe
         */
        Observable.prototype.subscribe = function (observerOrNext, error, complete) {
            var operator = this.operator;
            var sink = toSubscriber(observerOrNext, error, complete);
            if (operator) {
                operator.call(sink, this.source);
            }
            else {
                sink.add(this.source || !sink.syncErrorThrowable ? this._subscribe(sink) : this._trySubscribe(sink));
            }
            if (sink.syncErrorThrowable) {
                sink.syncErrorThrowable = false;
                if (sink.syncErrorThrown) {
                    throw sink.syncErrorValue;
                }
            }
            return sink;
        };
        Observable.prototype._trySubscribe = function (sink) {
            try {
                return this._subscribe(sink);
            }
            catch (err) {
                sink.syncErrorThrown = true;
                sink.syncErrorValue = err;
                sink.error(err);
            }
        };
        /**
         * @method forEach
         * @param {Function} next a handler for each value emitted by the observable
         * @param {PromiseConstructor} [PromiseCtor] a constructor function used to instantiate the Promise
         * @return {Promise} a promise that either resolves on observable completion or
         *  rejects with the handled error
         */
        Observable.prototype.forEach = function (next, PromiseCtor) {
            var _this = this;
            if (!PromiseCtor) {
                if (_root.Rx && _root.Rx.config && _root.Rx.config.Promise) {
                    PromiseCtor = _root.Rx.config.Promise;
                }
                else if (_root.Promise) {
                    PromiseCtor = _root.Promise;
                }
            }
            if (!PromiseCtor) {
                throw new Error('no Promise impl found');
            }
            return new PromiseCtor(function (resolve, reject) {
                // Must be declared in a separate statement to avoid a RefernceError when
                // accessing subscription below in the closure due to Temporal Dead Zone.
                var subscription;
                subscription = _this.subscribe(function (value) {
                    if (subscription) {
                        // if there is a subscription, then we can surmise
                        // the next handling is asynchronous. Any errors thrown
                        // need to be rejected explicitly and unsubscribe must be
                        // called manually
                        try {
                            next(value);
                        }
                        catch (err) {
                            reject(err);
                            subscription.unsubscribe();
                        }
                    }
                    else {
                        // if there is NO subscription, then we're getting a nexted
                        // value synchronously during subscription. We can just call it.
                        // If it errors, Observable's `subscribe` will ensure the
                        // unsubscription logic is called, then synchronously rethrow the error.
                        // After that, Promise will trap the error and send it
                        // down the rejection path.
                        next(value);
                    }
                }, reject, resolve);
            });
        };
        Observable.prototype._subscribe = function (subscriber) {
            return this.source.subscribe(subscriber);
        };
        /**
         * An interop point defined by the es7-observable spec https://github.com/zenparsing/es-observable
         * @method Symbol.observable
         * @return {Observable} this instance of the observable
         */
        Observable.prototype[observable] = function () {
            return this;
        };
        /* tslint:enable:max-line-length */
        /**
         * Used to stitch together functional operators into a chain.
         * @method pipe
         * @return {Observable} the Observable result of all of the operators having
         * been called in the order they were passed in.
         *
         * @example
         *
         * import { map, filter, scan } from 'rxjs/operators';
         *
         * Rx.Observable.interval(1000)
         *   .pipe(
         *     filter(x => x % 2 === 0),
         *     map(x => x + x),
         *     scan((acc, x) => acc + x)
         *   )
         *   .subscribe(x => console.log(x))
         */
        Observable.prototype.pipe = function () {
            var operations = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                operations[_i - 0] = arguments[_i];
            }
            if (operations.length === 0) {
                return this;
            }
            return pipeFromArray(operations)(this);
        };
        /* tslint:enable:max-line-length */
        Observable.prototype.toPromise = function (PromiseCtor) {
            var _this = this;
            if (!PromiseCtor) {
                if (_root.Rx && _root.Rx.config && _root.Rx.config.Promise) {
                    PromiseCtor = _root.Rx.config.Promise;
                }
                else if (_root.Promise) {
                    PromiseCtor = _root.Promise;
                }
            }
            if (!PromiseCtor) {
                throw new Error('no Promise impl found');
            }
            return new PromiseCtor(function (resolve, reject) {
                var value;
                _this.subscribe(function (x) {
                    return value = x;
                }, function (err) {
                    return reject(err);
                }, function () {
                    return resolve(value);
                });
            });
        };
        // HACK: Since TypeScript inherits static properties too, we have to
        // fight against TypeScript here so Subject can have a different static create signature
        /**
         * Creates a new cold Observable by calling the Observable constructor
         * @static true
         * @owner Observable
         * @method create
         * @param {Function} subscribe? the subscriber function to be passed to the Observable constructor
         * @return {Observable} a new cold observable
         */
        Observable.create = function (subscribe) {
            return new Observable(subscribe);
        };
        return Observable;
    }());

    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @extends {Ignored}
     * @hide true
     */
    var ScalarObservable = /*@__PURE__*/ (function (_super) {
        __extends(ScalarObservable, _super);

        function ScalarObservable(value, scheduler) {
            _super.call(this);
            this.value = value;
            this.scheduler = scheduler;
            this._isScalar = true;
            if (scheduler) {
                this._isScalar = false;
            }
        }

        ScalarObservable.create = function (value, scheduler) {
            return new ScalarObservable(value, scheduler);
        };
        ScalarObservable.dispatch = function (state) {
            var done = state.done, value = state.value, subscriber = state.subscriber;
            if (done) {
                subscriber.complete();
                return;
            }
            subscriber.next(value);
            if (subscriber.closed) {
                return;
            }
            state.done = true;
            this.schedule(state);
        };
        ScalarObservable.prototype._subscribe = function (subscriber) {
            var value = this.value;
            var scheduler = this.scheduler;
            if (scheduler) {
                return scheduler.schedule(ScalarObservable.dispatch, 0, {
                    done: false, value: value, subscriber: subscriber
                });
            }
            else {
                subscriber.next(value);
                if (!subscriber.closed) {
                    subscriber.complete();
                }
            }
        };
        return ScalarObservable;
    }(Observable));

    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @extends {Ignored}
     * @hide true
     */
    var EmptyObservable = /*@__PURE__*/ (function (_super) {
        __extends(EmptyObservable, _super);

        function EmptyObservable(scheduler) {
            _super.call(this);
            this.scheduler = scheduler;
        }

        /**
         * Creates an Observable that emits no items to the Observer and immediately
         * emits a complete notification.
         *
         * <span class="informal">Just emits 'complete', and nothing else.
         * </span>
         *
         * <img src="./img/empty.png" width="100%">
         *
         * This static operator is useful for creating a simple Observable that only
         * emits the complete notification. It can be used for composing with other
         * Observables, such as in a {@link mergeMap}.
         *
         * @example <caption>Emit the number 7, then complete.</caption>
         * var result = Rx.Observable.empty().startWith(7);
         * result.subscribe(x => console.log(x));
         *
         * @example <caption>Map and flatten only odd numbers to the sequence 'a', 'b', 'c'</caption>
         * var interval = Rx.Observable.interval(1000);
         * var result = interval.mergeMap(x =>
         *   x % 2 === 1 ? Rx.Observable.of('a', 'b', 'c') : Rx.Observable.empty()
         * );
         * result.subscribe(x => console.log(x));
         *
         * // Results in the following to the console:
         * // x is equal to the count on the interval eg(0,1,2,3,...)
         * // x will occur every 1000ms
         * // if x % 2 is equal to 1 print abc
         * // if x % 2 is not equal to 1 nothing will be output
         *
         * @see {@link create}
         * @see {@link never}
         * @see {@link of}
         * @see {@link throw}
         *
         * @param {Scheduler} [scheduler] A {@link IScheduler} to use for scheduling
         * the emission of the complete notification.
         * @return {Observable} An "empty" Observable: emits only the complete
         * notification.
         * @static true
         * @name empty
         * @owner Observable
         */
        EmptyObservable.create = function (scheduler) {
            return new EmptyObservable(scheduler);
        };
        EmptyObservable.dispatch = function (arg) {
            var subscriber = arg.subscriber;
            subscriber.complete();
        };
        EmptyObservable.prototype._subscribe = function (subscriber) {
            var scheduler = this.scheduler;
            if (scheduler) {
                return scheduler.schedule(EmptyObservable.dispatch, 0, {subscriber: subscriber});
            }
            else {
                subscriber.complete();
            }
        };
        return EmptyObservable;
    }(Observable));

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    function isScheduler(value) {
        return value && typeof value.schedule === 'function';
    }

    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @extends {Ignored}
     * @hide true
     */
    var ArrayObservable = /*@__PURE__*/ (function (_super) {
        __extends(ArrayObservable, _super);

        function ArrayObservable(array, scheduler) {
            _super.call(this);
            this.array = array;
            this.scheduler = scheduler;
            if (!scheduler && array.length === 1) {
                this._isScalar = true;
                this.value = array[0];
            }
        }

        ArrayObservable.create = function (array, scheduler) {
            return new ArrayObservable(array, scheduler);
        };
        /**
         * Creates an Observable that emits some values you specify as arguments,
         * immediately one after the other, and then emits a complete notification.
         *
         * <span class="informal">Emits the arguments you provide, then completes.
         * </span>
         *
         * <img src="./img/of.png" width="100%">
         *
         * This static operator is useful for creating a simple Observable that only
         * emits the arguments given, and the complete notification thereafter. It can
         * be used for composing with other Observables, such as with {@link concat}.
         * By default, it uses a `null` IScheduler, which means the `next`
         * notifications are sent synchronously, although with a different IScheduler
         * it is possible to determine when those notifications will be delivered.
         *
         * @example <caption>Emit 10, 20, 30, then 'a', 'b', 'c', then start ticking every second.</caption>
         * var numbers = Rx.Observable.of(10, 20, 30);
         * var letters = Rx.Observable.of('a', 'b', 'c');
         * var interval = Rx.Observable.interval(1000);
         * var result = numbers.concat(letters).concat(interval);
         * result.subscribe(x => console.log(x));
         *
         * @see {@link create}
         * @see {@link empty}
         * @see {@link never}
         * @see {@link throw}
         *
         * @param {...T} values Arguments that represent `next` values to be emitted.
         * @param {Scheduler} [scheduler] A {@link IScheduler} to use for scheduling
         * the emissions of the `next` notifications.
         * @return {Observable<T>} An Observable that emits each given input value.
         * @static true
         * @name of
         * @owner Observable
         */
        ArrayObservable.of = function () {
            var array = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                array[_i - 0] = arguments[_i];
            }
            var scheduler = array[array.length - 1];
            if (isScheduler(scheduler)) {
                array.pop();
            }
            else {
                scheduler = null;
            }
            var len = array.length;
            if (len > 1) {
                return new ArrayObservable(array, scheduler);
            }
            else if (len === 1) {
                return new ScalarObservable(array[0], scheduler);
            }
            else {
                return new EmptyObservable(scheduler);
            }
        };
        ArrayObservable.dispatch = function (state) {
            var array = state.array, index = state.index, count = state.count, subscriber = state.subscriber;
            if (index >= count) {
                subscriber.complete();
                return;
            }
            subscriber.next(array[index]);
            if (subscriber.closed) {
                return;
            }
            state.index = index + 1;
            this.schedule(state);
        };
        ArrayObservable.prototype._subscribe = function (subscriber) {
            var index = 0;
            var array = this.array;
            var count = array.length;
            var scheduler = this.scheduler;
            if (scheduler) {
                return scheduler.schedule(ArrayObservable.dispatch, 0, {
                    array: array, index: index, count: count, subscriber: subscriber
                });
            }
            else {
                for (var i = 0; i < count && !subscriber.closed; i++) {
                    subscriber.next(array[i]);
                }
                subscriber.complete();
            }
        };
        return ArrayObservable;
    }(Observable));

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    var isArrayLike = (function (x) {
        return x && typeof x.length === 'number';
    });

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    function isPromise(value) {
        return value && typeof value.subscribe !== 'function' && typeof value.then === 'function';
    }

    /** PURE_IMPORTS_START .._util_root PURE_IMPORTS_END */
    function symbolIteratorPonyfill(root) {
        var Symbol = root.Symbol;
        if (typeof Symbol === 'function') {
            if (!Symbol.iterator) {
                Symbol.iterator = Symbol('iterator polyfill');
            }
            return Symbol.iterator;
        }
        else {
            // [for Mozilla Gecko 27-35:](https://mzl.la/2ewE1zC)
            var Set_1 = root.Set;
            if (Set_1 && typeof new Set_1()['@@iterator'] === 'function') {
                return '@@iterator';
            }
            var Map_1 = root.Map;
            // required for compatability with es6-shim
            if (Map_1) {
                var keys = Object.getOwnPropertyNames(Map_1.prototype);
                for (var i = 0; i < keys.length; ++i) {
                    var key = keys[i];
                    // according to spec, Map.prototype[@@iterator] and Map.orototype.entries must be equal.
                    if (key !== 'entries' && key !== 'size' && Map_1.prototype[key] === Map_1.prototype['entries']) {
                        return key;
                    }
                }
            }
            return '@@iterator';
        }
    }

    var iterator = /*@__PURE__*/ symbolIteratorPonyfill(_root);
    /**
     * @deprecated use iterator instead
     */

    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @ignore
     * @extends {Ignored}
     */
    var InnerSubscriber = /*@__PURE__*/ (function (_super) {
        __extends(InnerSubscriber, _super);

        function InnerSubscriber(parent, outerValue, outerIndex) {
            _super.call(this);
            this.parent = parent;
            this.outerValue = outerValue;
            this.outerIndex = outerIndex;
            this.index = 0;
        }

        InnerSubscriber.prototype._next = function (value) {
            this.parent.notifyNext(this.outerValue, value, this.outerIndex, this.index++, this);
        };
        InnerSubscriber.prototype._error = function (error) {
            this.parent.notifyError(error, this);
            this.unsubscribe();
        };
        InnerSubscriber.prototype._complete = function () {
            this.parent.notifyComplete(this);
            this.unsubscribe();
        };
        return InnerSubscriber;
    }(Subscriber));

    /** PURE_IMPORTS_START ._root,._isArrayLike,._isPromise,._isObject,.._Observable,.._symbol_iterator,.._InnerSubscriber,.._symbol_observable PURE_IMPORTS_END */
    function subscribeToResult(outerSubscriber, result, outerValue, outerIndex) {
        var destination = new InnerSubscriber(outerSubscriber, outerValue, outerIndex);
        if (destination.closed) {
            return null;
        }
        if (result instanceof Observable) {
            if (result._isScalar) {
                destination.next(result.value);
                destination.complete();
                return null;
            }
            else {
                destination.syncErrorThrowable = true;
                return result.subscribe(destination);
            }
        }
        else if (isArrayLike(result)) {
            for (var i = 0, len = result.length; i < len && !destination.closed; i++) {
                destination.next(result[i]);
            }
            if (!destination.closed) {
                destination.complete();
            }
        }
        else if (isPromise(result)) {
            result.then(function (value) {
                if (!destination.closed) {
                    destination.next(value);
                    destination.complete();
                }
            }, function (err) {
                return destination.error(err);
            })
                .then(null, function (err) {
                    // Escaping the Promise trap: globally throw unhandled errors
                    _root.setTimeout(function () {
                        throw err;
                    });
                });
            return destination;
        }
        else if (result && typeof result[iterator] === 'function') {
            var iterator$$1 = result[iterator]();
            do {
                var item = iterator$$1.next();
                if (item.done) {
                    destination.complete();
                    break;
                }
                destination.next(item.value);
                if (destination.closed) {
                    break;
                }
            } while (true);
        }
        else if (result && typeof result[observable] === 'function') {
            var obs = result[observable]();
            if (typeof obs.subscribe !== 'function') {
                destination.error(new TypeError('Provided object does not correctly implement Symbol.observable'));
            }
            else {
                return obs.subscribe(new InnerSubscriber(outerSubscriber, outerValue, outerIndex));
            }
        }
        else {
            var value = isObject(result) ? 'an invalid object' : "'" + result + "'";
            var msg = ("You provided " + value + " where a stream was expected.")
                + ' You can provide an Observable, Promise, Array, or Iterable.';
            destination.error(new TypeError(msg));
        }
        return null;
    }

    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @ignore
     * @extends {Ignored}
     */
    var OuterSubscriber = /*@__PURE__*/ (function (_super) {
        __extends(OuterSubscriber, _super);

        function OuterSubscriber() {
            _super.apply(this, arguments);
        }

        OuterSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
            this.destination.next(innerValue);
        };
        OuterSubscriber.prototype.notifyError = function (error, innerSub) {
            this.destination.error(error);
        };
        OuterSubscriber.prototype.notifyComplete = function (innerSub) {
            this.destination.complete();
        };
        return OuterSubscriber;
    }(Subscriber));

    /* tslint:enable:max-line-length */
    /**
     * Projects each source value to an Observable which is merged in the output
     * Observable.
     *
     * <span class="informal">Maps each value to an Observable, then flattens all of
     * these inner Observables using {@link mergeAll}.</span>
     *
     * <img src="./img/mergeMap.png" width="100%">
     *
     * Returns an Observable that emits items based on applying a function that you
     * supply to each item emitted by the source Observable, where that function
     * returns an Observable, and then merging those resulting Observables and
     * emitting the results of this merger.
     *
     * @example <caption>Map and flatten each letter to an Observable ticking every 1 second</caption>
     * var letters = Rx.Observable.of('a', 'b', 'c');
     * var result = letters.mergeMap(x =>
     *   Rx.Observable.interval(1000).map(i => x+i)
     * );
     * result.subscribe(x => console.log(x));
     *
     * // Results in the following:
     * // a0
     * // b0
     * // c0
     * // a1
     * // b1
     * // c1
     * // continues to list a,b,c with respective ascending integers
     *
     * @see {@link concatMap}
     * @see {@link exhaustMap}
     * @see {@link merge}
     * @see {@link mergeAll}
     * @see {@link mergeMapTo}
     * @see {@link mergeScan}
     * @see {@link switchMap}
     *
     * @param {function(value: T, ?index: number): ObservableInput} project A function
     * that, when applied to an item emitted by the source Observable, returns an
     * Observable.
     * @param {function(outerValue: T, innerValue: I, outerIndex: number, innerIndex: number): any} [resultSelector]
     * A function to produce the value on the output Observable based on the values
     * and the indices of the source (outer) emission and the inner Observable
     * emission. The arguments passed to this function are:
     * - `outerValue`: the value that came from the source
     * - `innerValue`: the value that came from the projected Observable
     * - `outerIndex`: the "index" of the value that came from the source
     * - `innerIndex`: the "index" of the value from the projected Observable
     * @param {number} [concurrent=Number.POSITIVE_INFINITY] Maximum number of input
     * Observables being subscribed to concurrently.
     * @return {Observable} An Observable that emits the result of applying the
     * projection function (and the optional `resultSelector`) to each item emitted
     * by the source Observable and merging the results of the Observables obtained
     * from this transformation.
     * @method mergeMap
     * @owner Observable
     */
    function mergeMap(project, resultSelector, concurrent) {
        if (concurrent === void 0) {
            concurrent = Number.POSITIVE_INFINITY;
        }
        return function mergeMapOperatorFunction(source) {
            if (typeof resultSelector === 'number') {
                concurrent = resultSelector;
                resultSelector = null;
            }
            return source.lift(new MergeMapOperator(project, resultSelector, concurrent));
        };
    }

    var MergeMapOperator = /*@__PURE__*/ (function () {
        function MergeMapOperator(project, resultSelector, concurrent) {
            if (concurrent === void 0) {
                concurrent = Number.POSITIVE_INFINITY;
            }
            this.project = project;
            this.resultSelector = resultSelector;
            this.concurrent = concurrent;
        }

        MergeMapOperator.prototype.call = function (observer, source) {
            return source.subscribe(new MergeMapSubscriber(observer, this.project, this.resultSelector, this.concurrent));
        };
        return MergeMapOperator;
    }());
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @ignore
     * @extends {Ignored}
     */
    var MergeMapSubscriber = /*@__PURE__*/ (function (_super) {
        __extends(MergeMapSubscriber, _super);

        function MergeMapSubscriber(destination, project, resultSelector, concurrent) {
            if (concurrent === void 0) {
                concurrent = Number.POSITIVE_INFINITY;
            }
            _super.call(this, destination);
            this.project = project;
            this.resultSelector = resultSelector;
            this.concurrent = concurrent;
            this.hasCompleted = false;
            this.buffer = [];
            this.active = 0;
            this.index = 0;
        }

        MergeMapSubscriber.prototype._next = function (value) {
            if (this.active < this.concurrent) {
                this._tryNext(value);
            }
            else {
                this.buffer.push(value);
            }
        };
        MergeMapSubscriber.prototype._tryNext = function (value) {
            var result;
            var index = this.index++;
            try {
                result = this.project(value, index);
            }
            catch (err) {
                this.destination.error(err);
                return;
            }
            this.active++;
            this._innerSub(result, value, index);
        };
        MergeMapSubscriber.prototype._innerSub = function (ish, value, index) {
            this.add(subscribeToResult(this, ish, value, index));
        };
        MergeMapSubscriber.prototype._complete = function () {
            this.hasCompleted = true;
            if (this.active === 0 && this.buffer.length === 0) {
                this.destination.complete();
            }
        };
        MergeMapSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
            if (this.resultSelector) {
                this._notifyResultSelector(outerValue, innerValue, outerIndex, innerIndex);
            }
            else {
                this.destination.next(innerValue);
            }
        };
        MergeMapSubscriber.prototype._notifyResultSelector = function (outerValue, innerValue, outerIndex, innerIndex) {
            var result;
            try {
                result = this.resultSelector(outerValue, innerValue, outerIndex, innerIndex);
            }
            catch (err) {
                this.destination.error(err);
                return;
            }
            this.destination.next(result);
        };
        MergeMapSubscriber.prototype.notifyComplete = function (innerSub) {
            var buffer = this.buffer;
            this.remove(innerSub);
            this.active--;
            if (buffer.length > 0) {
                this._next(buffer.shift());
            }
            else if (this.active === 0 && this.hasCompleted) {
                this.destination.complete();
            }
        };
        return MergeMapSubscriber;
    }(OuterSubscriber));

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    function identity(x) {
        return x;
    }

    /** PURE_IMPORTS_START ._mergeMap,.._util_identity PURE_IMPORTS_END */
    /**
     * Converts a higher-order Observable into a first-order Observable which
     * concurrently delivers all values that are emitted on the inner Observables.
     *
     * <span class="informal">Flattens an Observable-of-Observables.</span>
     *
     * <img src="./img/mergeAll.png" width="100%">
     *
     * `mergeAll` subscribes to an Observable that emits Observables, also known as
     * a higher-order Observable. Each time it observes one of these emitted inner
     * Observables, it subscribes to that and delivers all the values from the
     * inner Observable on the output Observable. The output Observable only
     * completes once all inner Observables have completed. Any error delivered by
     * a inner Observable will be immediately emitted on the output Observable.
     *
     * @example <caption>Spawn a new interval Observable for each click event, and blend their outputs as one Observable</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * var higherOrder = clicks.map((ev) => Rx.Observable.interval(1000));
     * var firstOrder = higherOrder.mergeAll();
     * firstOrder.subscribe(x => console.log(x));
     *
     * @example <caption>Count from 0 to 9 every second for each click, but only allow 2 concurrent timers</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * var higherOrder = clicks.map((ev) => Rx.Observable.interval(1000).take(10));
     * var firstOrder = higherOrder.mergeAll(2);
     * firstOrder.subscribe(x => console.log(x));
     *
     * @see {@link combineAll}
     * @see {@link concatAll}
     * @see {@link exhaust}
     * @see {@link merge}
     * @see {@link mergeMap}
     * @see {@link mergeMapTo}
     * @see {@link mergeScan}
     * @see {@link switch}
     * @see {@link zipAll}
     *
     * @param {number} [concurrent=Number.POSITIVE_INFINITY] Maximum number of inner
     * Observables being subscribed to concurrently.
     * @return {Observable} An Observable that emits values coming from all the
     * inner Observables emitted by the source Observable.
     * @method mergeAll
     * @owner Observable
     */
    function mergeAll(concurrent) {
        if (concurrent === void 0) {
            concurrent = Number.POSITIVE_INFINITY;
        }
        return mergeMap(identity, null, concurrent);
    }

    /** PURE_IMPORTS_START .._Observable,._ArrayObservable,.._util_isScheduler,.._operators_mergeAll PURE_IMPORTS_END */

    /* tslint:enable:max-line-length */
    /**
     * Creates an output Observable which concurrently emits all values from every
     * given input Observable.
     *
     * <span class="informal">Flattens multiple Observables together by blending
     * their values into one Observable.</span>
     *
     * <img src="./img/merge.png" width="100%">
     *
     * `merge` subscribes to each given input Observable (as arguments), and simply
     * forwards (without doing any transformation) all the values from all the input
     * Observables to the output Observable. The output Observable only completes
     * once all input Observables have completed. Any error delivered by an input
     * Observable will be immediately emitted on the output Observable.
     *
     * @example <caption>Merge together two Observables: 1s interval and clicks</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * var timer = Rx.Observable.interval(1000);
     * var clicksOrTimer = Rx.Observable.merge(clicks, timer);
     * clicksOrTimer.subscribe(x => console.log(x));
     *
     * // Results in the following:
     * // timer will emit ascending values, one every second(1000ms) to console
     * // clicks logs MouseEvents to console everytime the "document" is clicked
     * // Since the two streams are merged you see these happening
     * // as they occur.
     *
     * @example <caption>Merge together 3 Observables, but only 2 run concurrently</caption>
     * var timer1 = Rx.Observable.interval(1000).take(10);
     * var timer2 = Rx.Observable.interval(2000).take(6);
     * var timer3 = Rx.Observable.interval(500).take(10);
     * var concurrent = 2; // the argument
     * var merged = Rx.Observable.merge(timer1, timer2, timer3, concurrent);
     * merged.subscribe(x => console.log(x));
     *
     * // Results in the following:
     * // - First timer1 and timer2 will run concurrently
     * // - timer1 will emit a value every 1000ms for 10 iterations
     * // - timer2 will emit a value every 2000ms for 6 iterations
     * // - after timer1 hits it's max iteration, timer2 will
     * //   continue, and timer3 will start to run concurrently with timer2
     * // - when timer2 hits it's max iteration it terminates, and
     * //   timer3 will continue to emit a value every 500ms until it is complete
     *
     * @see {@link mergeAll}
     * @see {@link mergeMap}
     * @see {@link mergeMapTo}
     * @see {@link mergeScan}
     *
     * @param {...ObservableInput} observables Input Observables to merge together.
     * @param {number} [concurrent=Number.POSITIVE_INFINITY] Maximum number of input
     * Observables being subscribed to concurrently.
     * @param {Scheduler} [scheduler=null] The IScheduler to use for managing
     * concurrency of input Observables.
     * @return {Observable} an Observable that emits items that are the result of
     * every input Observable.
     * @static true
     * @name merge
     * @owner Observable
     */
    function merge() {
        var observables = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            observables[_i - 0] = arguments[_i];
        }
        var concurrent = Number.POSITIVE_INFINITY;
        var scheduler = null;
        var last = observables[observables.length - 1];
        if (isScheduler(last)) {
            scheduler = observables.pop();
            if (observables.length > 1 && typeof observables[observables.length - 1] === 'number') {
                concurrent = observables.pop();
            }
        }
        else if (typeof last === 'number') {
            concurrent = observables.pop();
        }
        if (scheduler === null && observables.length === 1 && observables[0] instanceof Observable) {
            return observables[0];
        }
        return mergeAll(concurrent)(new ArrayObservable(observables, scheduler));
    }

    /**
     * An error thrown when an action is invalid because the object has been
     * unsubscribed.
     *
     * @see {@link Subject}
     * @see {@link BehaviorSubject}
     *
     * @class ObjectUnsubscribedError
     */
    var ObjectUnsubscribedError = /*@__PURE__*/ (function (_super) {
        __extends(ObjectUnsubscribedError, _super);

        function ObjectUnsubscribedError() {
            var err = _super.call(this, 'object unsubscribed');
            this.name = err.name = 'ObjectUnsubscribedError';
            this.stack = err.stack;
            this.message = err.message;
        }

        return ObjectUnsubscribedError;
    }(Error));

    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @ignore
     * @extends {Ignored}
     */
    var SubjectSubscription = /*@__PURE__*/ (function (_super) {
        __extends(SubjectSubscription, _super);

        function SubjectSubscription(subject, subscriber) {
            _super.call(this);
            this.subject = subject;
            this.subscriber = subscriber;
            this.closed = false;
        }

        SubjectSubscription.prototype.unsubscribe = function () {
            if (this.closed) {
                return;
            }
            this.closed = true;
            var subject = this.subject;
            var observers = subject.observers;
            this.subject = null;
            if (!observers || observers.length === 0 || subject.isStopped || subject.closed) {
                return;
            }
            var subscriberIndex = observers.indexOf(this.subscriber);
            if (subscriberIndex !== -1) {
                observers.splice(subscriberIndex, 1);
            }
        };
        return SubjectSubscription;
    }(Subscription));

    /**
     * @class SubjectSubscriber<T>
     */
    var SubjectSubscriber = /*@__PURE__*/ (function (_super) {
        __extends(SubjectSubscriber, _super);

        function SubjectSubscriber(destination) {
            _super.call(this, destination);
            this.destination = destination;
        }

        return SubjectSubscriber;
    }(Subscriber));
    /**
     * @class Subject<T>
     */
    var Subject = /*@__PURE__*/ (function (_super) {
        __extends(Subject, _super);

        function Subject() {
            _super.call(this);
            this.observers = [];
            this.closed = false;
            this.isStopped = false;
            this.hasError = false;
            this.thrownError = null;
        }

        Subject.prototype[rxSubscriber] = function () {
            return new SubjectSubscriber(this);
        };
        Subject.prototype.lift = function (operator) {
            var subject = new AnonymousSubject(this, this);
            subject.operator = operator;
            return subject;
        };
        Subject.prototype.next = function (value) {
            if (this.closed) {
                throw new ObjectUnsubscribedError();
            }
            if (!this.isStopped) {
                var observers = this.observers;
                var len = observers.length;
                var copy = observers.slice();
                for (var i = 0; i < len; i++) {
                    copy[i].next(value);
                }
            }
        };
        Subject.prototype.error = function (err) {
            if (this.closed) {
                throw new ObjectUnsubscribedError();
            }
            this.hasError = true;
            this.thrownError = err;
            this.isStopped = true;
            var observers = this.observers;
            var len = observers.length;
            var copy = observers.slice();
            for (var i = 0; i < len; i++) {
                copy[i].error(err);
            }
            this.observers.length = 0;
        };
        Subject.prototype.complete = function () {
            if (this.closed) {
                throw new ObjectUnsubscribedError();
            }
            this.isStopped = true;
            var observers = this.observers;
            var len = observers.length;
            var copy = observers.slice();
            for (var i = 0; i < len; i++) {
                copy[i].complete();
            }
            this.observers.length = 0;
        };
        Subject.prototype.unsubscribe = function () {
            this.isStopped = true;
            this.closed = true;
            this.observers = null;
        };
        Subject.prototype._trySubscribe = function (subscriber) {
            if (this.closed) {
                throw new ObjectUnsubscribedError();
            }
            else {
                return _super.prototype._trySubscribe.call(this, subscriber);
            }
        };
        Subject.prototype._subscribe = function (subscriber) {
            if (this.closed) {
                throw new ObjectUnsubscribedError();
            }
            else if (this.hasError) {
                subscriber.error(this.thrownError);
                return Subscription.EMPTY;
            }
            else if (this.isStopped) {
                subscriber.complete();
                return Subscription.EMPTY;
            }
            else {
                this.observers.push(subscriber);
                return new SubjectSubscription(this, subscriber);
            }
        };
        Subject.prototype.asObservable = function () {
            var observable = new Observable();
            observable.source = this;
            return observable;
        };
        Subject.create = function (destination, source) {
            return new AnonymousSubject(destination, source);
        };
        return Subject;
    }(Observable));
    /**
     * @class AnonymousSubject<T>
     */
    var AnonymousSubject = /*@__PURE__*/ (function (_super) {
        __extends(AnonymousSubject, _super);

        function AnonymousSubject(destination, source) {
            _super.call(this);
            this.destination = destination;
            this.source = source;
        }

        AnonymousSubject.prototype.next = function (value) {
            var destination = this.destination;
            if (destination && destination.next) {
                destination.next(value);
            }
        };
        AnonymousSubject.prototype.error = function (err) {
            var destination = this.destination;
            if (destination && destination.error) {
                this.destination.error(err);
            }
        };
        AnonymousSubject.prototype.complete = function () {
            var destination = this.destination;
            if (destination && destination.complete) {
                this.destination.complete();
            }
        };
        AnonymousSubject.prototype._subscribe = function (subscriber) {
            var source = this.source;
            if (source) {
                return this.source.subscribe(subscriber);
            }
            else {
                return Subscription.EMPTY;
            }
        };
        return AnonymousSubject;
    }(Subject));

    function refCount() {
        return function refCountOperatorFunction(source) {
            return source.lift(new RefCountOperator(source));
        };
    }

    var RefCountOperator = /*@__PURE__*/ (function () {
        function RefCountOperator(connectable) {
            this.connectable = connectable;
        }

        RefCountOperator.prototype.call = function (subscriber, source) {
            var connectable = this.connectable;
            connectable._refCount++;
            var refCounter = new RefCountSubscriber(subscriber, connectable);
            var subscription = source.subscribe(refCounter);
            if (!refCounter.closed) {
                refCounter.connection = connectable.connect();
            }
            return subscription;
        };
        return RefCountOperator;
    }());
    var RefCountSubscriber = /*@__PURE__*/ (function (_super) {
        __extends(RefCountSubscriber, _super);

        function RefCountSubscriber(destination, connectable) {
            _super.call(this, destination);
            this.connectable = connectable;
        }

        RefCountSubscriber.prototype._unsubscribe = function () {
            var connectable = this.connectable;
            if (!connectable) {
                this.connection = null;
                return;
            }
            this.connectable = null;
            var refCount = connectable._refCount;
            if (refCount <= 0) {
                this.connection = null;
                return;
            }
            connectable._refCount = refCount - 1;
            if (refCount > 1) {
                this.connection = null;
                return;
            }
            ///
            // Compare the local RefCountSubscriber's connection Subscription to the
            // connection Subscription on the shared ConnectableObservable. In cases
            // where the ConnectableObservable source synchronously emits values, and
            // the RefCountSubscriber's downstream Observers synchronously unsubscribe,
            // execution continues to here before the RefCountOperator has a chance to
            // supply the RefCountSubscriber with the shared connection Subscription.
            // For example:
            // ```
            // Observable.range(0, 10)
            //   .publish()
            //   .refCount()
            //   .take(5)
            //   .subscribe();
            // ```
            // In order to account for this case, RefCountSubscriber should only dispose
            // the ConnectableObservable's shared connection Subscription if the
            // connection Subscription exists, *and* either:
            //   a. RefCountSubscriber doesn't have a reference to the shared connection
            //      Subscription yet, or,
            //   b. RefCountSubscriber's connection Subscription reference is identical
            //      to the shared connection Subscription
            ///
            var connection = this.connection;
            var sharedConnection = connectable._connection;
            this.connection = null;
            if (sharedConnection && (!connection || sharedConnection === connection)) {
                sharedConnection.unsubscribe();
            }
        };
        return RefCountSubscriber;
    }(Subscriber));

    /**
     * @class ConnectableObservable<T>
     */
    var ConnectableObservable = /*@__PURE__*/ (function (_super) {
        __extends(ConnectableObservable, _super);

        function ConnectableObservable(source, subjectFactory) {
            _super.call(this);
            this.source = source;
            this.subjectFactory = subjectFactory;
            this._refCount = 0;
            this._isComplete = false;
        }

        ConnectableObservable.prototype._subscribe = function (subscriber) {
            return this.getSubject().subscribe(subscriber);
        };
        ConnectableObservable.prototype.getSubject = function () {
            var subject = this._subject;
            if (!subject || subject.isStopped) {
                this._subject = this.subjectFactory();
            }
            return this._subject;
        };
        ConnectableObservable.prototype.connect = function () {
            var connection = this._connection;
            if (!connection) {
                this._isComplete = false;
                connection = this._connection = new Subscription();
                connection.add(this.source
                    .subscribe(new ConnectableSubscriber(this.getSubject(), this)));
                if (connection.closed) {
                    this._connection = null;
                    connection = Subscription.EMPTY;
                }
                else {
                    this._connection = connection;
                }
            }
            return connection;
        };
        ConnectableObservable.prototype.refCount = function () {
            return refCount()(this);
        };
        return ConnectableObservable;
    }(Observable));
    var connectableProto = ConnectableObservable.prototype;
    var connectableObservableDescriptor = {
        operator: {value: null},
        _refCount: {value: 0, writable: true},
        _subject: {value: null, writable: true},
        _connection: {value: null, writable: true},
        _subscribe: {value: connectableProto._subscribe},
        _isComplete: {value: connectableProto._isComplete, writable: true},
        getSubject: {value: connectableProto.getSubject},
        connect: {value: connectableProto.connect},
        refCount: {value: connectableProto.refCount}
    };
    var ConnectableSubscriber = /*@__PURE__*/ (function (_super) {
        __extends(ConnectableSubscriber, _super);

        function ConnectableSubscriber(destination, connectable) {
            _super.call(this, destination);
            this.connectable = connectable;
        }

        ConnectableSubscriber.prototype._error = function (err) {
            this._unsubscribe();
            _super.prototype._error.call(this, err);
        };
        ConnectableSubscriber.prototype._complete = function () {
            this.connectable._isComplete = true;
            this._unsubscribe();
            _super.prototype._complete.call(this);
        };
        ConnectableSubscriber.prototype._unsubscribe = function () {
            var connectable = this.connectable;
            if (connectable) {
                this.connectable = null;
                var connection = connectable._connection;
                connectable._refCount = 0;
                connectable._subject = null;
                connectable._connection = null;
                if (connection) {
                    connection.unsubscribe();
                }
            }
        };
        return ConnectableSubscriber;
    }(SubjectSubscriber));
    var RefCountSubscriber$1 = /*@__PURE__*/ (function (_super) {
        __extends(RefCountSubscriber, _super);

        function RefCountSubscriber(destination, connectable) {
            _super.call(this, destination);
            this.connectable = connectable;
        }

        RefCountSubscriber.prototype._unsubscribe = function () {
            var connectable = this.connectable;
            if (!connectable) {
                this.connection = null;
                return;
            }
            this.connectable = null;
            var refCount$$1 = connectable._refCount;
            if (refCount$$1 <= 0) {
                this.connection = null;
                return;
            }
            connectable._refCount = refCount$$1 - 1;
            if (refCount$$1 > 1) {
                this.connection = null;
                return;
            }
            ///
            // Compare the local RefCountSubscriber's connection Subscription to the
            // connection Subscription on the shared ConnectableObservable. In cases
            // where the ConnectableObservable source synchronously emits values, and
            // the RefCountSubscriber's downstream Observers synchronously unsubscribe,
            // execution continues to here before the RefCountOperator has a chance to
            // supply the RefCountSubscriber with the shared connection Subscription.
            // For example:
            // ```
            // Observable.range(0, 10)
            //   .publish()
            //   .refCount()
            //   .take(5)
            //   .subscribe();
            // ```
            // In order to account for this case, RefCountSubscriber should only dispose
            // the ConnectableObservable's shared connection Subscription if the
            // connection Subscription exists, *and* either:
            //   a. RefCountSubscriber doesn't have a reference to the shared connection
            //      Subscription yet, or,
            //   b. RefCountSubscriber's connection Subscription reference is identical
            //      to the shared connection Subscription
            ///
            var connection = this.connection;
            var sharedConnection = connectable._connection;
            this.connection = null;
            if (sharedConnection && (!connection || sharedConnection === connection)) {
                sharedConnection.unsubscribe();
            }
        };
        return RefCountSubscriber;
    }(Subscriber));

    /** PURE_IMPORTS_START .._observable_ConnectableObservable PURE_IMPORTS_END */

    /* tslint:enable:max-line-length */
    /**
     * Returns an Observable that emits the results of invoking a specified selector on items
     * emitted by a ConnectableObservable that shares a single subscription to the underlying stream.
     *
     * <img src="./img/multicast.png" width="100%">
     *
     * @param {Function|Subject} subjectOrSubjectFactory - Factory function to create an intermediate subject through
     * which the source sequence's elements will be multicast to the selector function
     * or Subject to push source elements into.
     * @param {Function} [selector] - Optional selector function that can use the multicasted source stream
     * as many times as needed, without causing multiple subscriptions to the source stream.
     * Subscribers to the given source will receive all notifications of the source from the
     * time of the subscription forward.
     * @return {Observable} An Observable that emits the results of invoking the selector
     * on the items emitted by a `ConnectableObservable` that shares a single subscription to
     * the underlying stream.
     * @method multicast
     * @owner Observable
     */
    function multicast(subjectOrSubjectFactory, selector) {
        return function multicastOperatorFunction(source) {
            var subjectFactory;
            if (typeof subjectOrSubjectFactory === 'function') {
                subjectFactory = subjectOrSubjectFactory;
            }
            else {
                subjectFactory = function subjectFactory() {
                    return subjectOrSubjectFactory;
                };
            }
            if (typeof selector === 'function') {
                return source.lift(new MulticastOperator(subjectFactory, selector));
            }
            var connectable = Object.create(source, connectableObservableDescriptor);
            connectable.source = source;
            connectable.subjectFactory = subjectFactory;
            return connectable;
        };
    }

    var MulticastOperator = /*@__PURE__*/ (function () {
        function MulticastOperator(subjectFactory, selector) {
            this.subjectFactory = subjectFactory;
            this.selector = selector;
        }

        MulticastOperator.prototype.call = function (subscriber, source) {
            var selector = this.selector;
            var subject = this.subjectFactory();
            var subscription = selector(subject).subscribe(subscriber);
            subscription.add(source.subscribe(subject));
            return subscription;
        };
        return MulticastOperator;
    }());

    /** PURE_IMPORTS_START ._multicast,._refCount,.._Subject PURE_IMPORTS_END */
    function shareSubjectFactory() {
        return new Subject();
    }

    /**
     * Returns a new Observable that multicasts (shares) the original Observable. As long as there is at least one
     * Subscriber this Observable will be subscribed and emitting data. When all subscribers have unsubscribed it will
     * unsubscribe from the source Observable. Because the Observable is multicasting it makes the stream `hot`.
     * This is an alias for .multicast(() => new Subject()).refCount().
     *
     * <img src="./img/share.png" width="100%">
     *
     * @return {Observable<T>} An Observable that upon connection causes the source Observable to emit items to its Observers.
     * @method share
     * @owner Observable
     */
    function share() {
        return function (source) {
            return refCount()(multicast(shareSubjectFactory)(source));
        };
    }

    /** PURE_IMPORTS_START .._operators_share PURE_IMPORTS_END */
    /**
     * Returns a new Observable that multicasts (shares) the original Observable. As long as there is at least one
     * Subscriber this Observable will be subscribed and emitting data. When all subscribers have unsubscribed it will
     * unsubscribe from the source Observable. Because the Observable is multicasting it makes the stream `hot`.
     *
     * This behaves similarly to .publish().refCount(), with a behavior difference when the source observable emits complete.
     * .publish().refCount() will not resubscribe to the original source, however .share() will resubscribe to the original source.
     * Observable.of("test").publish().refCount() will not re-emit "test" on new subscriptions, Observable.of("test").share() will
     * re-emit "test" to new subscriptions.
     *
     * <img src="./img/share.png" width="100%">
     *
     * @return {Observable<T>} An Observable that upon connection causes the source Observable to emit items to its Observers.
     * @method share
     * @owner Observable
     */
    function share$1() {
        return share()(this);
    }

    /**
     * @license Angular v6.0.0-beta.3-67cf712
     * (c) 2010-2018 Google, Inc. https://angular.io/
     * License: MIT
     */
    /** PURE_IMPORTS_START tslib,rxjs_Observable,rxjs_observable_merge,rxjs_operator_share,rxjs_Subject,rxjs_Subscription PURE_IMPORTS_END */
    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * Creates a token that can be used in a DI Provider.
     *
     * Use an `InjectionToken` whenever the type you are injecting is not reified (does not have a
     * runtime representation) such as when injecting an interface, callable type, array or
     * parametrized type.
     *
     * `InjectionToken` is parameterized on `T` which is the type of object which will be returned by
     * the `Injector`. This provides additional level of type safety.
     *
     * ```
     * interface MyInterface {...}
     * var myInterface = injector.get(new InjectionToken<MyInterface>('SomeToken'));
     * // myInterface is inferred to be MyInterface.
     * ```
     *
     * ### Example
     *
     * {\@example core/di/ts/injector_spec.ts region='InjectionToken'}
     *
     * \@stable
     */
    var InjectionToken = /*@__PURE__*/ (/*@__PURE__*/ function () {
        function InjectionToken(_desc) {
            this._desc = _desc;
            /**
             * \@internal
             */
            this.ngMetadataName = 'InjectionToken';
        }

        /**
         * @return {?}
         */
        InjectionToken.prototype.toString = /**
         * @return {?}
         */
        function () {
            return "InjectionToken " + this._desc;
        };
        return InjectionToken;
    }());
    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * An interface implemented by all Angular type decorators, which allows them to be used as ES7
     * decorators as well as
     * Angular DSL syntax.
     *
     * ES7 syntax:
     *
     * ```
     * \@ng.Component({...})
     * class MyClass {...}
     * ```
     * \@stable
     * @record
     */
    var ANNOTATIONS = '__annotations__';
    var PARAMETERS = '__paramaters__';
    var PROP_METADATA = '__prop__metadata__';

    /**
     * @suppress {globalThis}
     * @param {?} name
     * @param {?=} props
     * @param {?=} parentClass
     * @param {?=} chainFn
     * @return {?}
     */
    function makeDecorator(name, props, parentClass, chainFn) {
        var /** @type {?} */ metaCtor = makeMetadataCtor(props);

        /**
         * @param {?} objOrType
         * @return {?}
         */
        function DecoratorFactory(objOrType) {
            if (this instanceof DecoratorFactory) {
                metaCtor.call(this, objOrType);
                return this;
            }
            var /** @type {?} */ annotationInstance = new ((DecoratorFactory))(objOrType);
            var /** @type {?} */ TypeDecorator = (function TypeDecorator(cls) {
                // Use of Object.defineProperty is important since it creates non-enumerable property which
                // prevents the property is copied during subclassing.
                var /** @type {?} */ annotations = cls.hasOwnProperty(ANNOTATIONS) ?
                    ((cls))[ANNOTATIONS] :
                    Object.defineProperty(cls, ANNOTATIONS, {value: []})[ANNOTATIONS];
                annotations.push(annotationInstance);
                return cls;
            });
            if (chainFn)
                chainFn(TypeDecorator);
            return TypeDecorator;
        }

        if (parentClass) {
            DecoratorFactory.prototype = Object.create(parentClass.prototype);
        }
        DecoratorFactory.prototype.ngMetadataName = name;
        ((DecoratorFactory)).annotationCls = DecoratorFactory;
        return /** @type {?} */ (DecoratorFactory);
    }

    /**
     * @param {?=} props
     * @return {?}
     */
    function makeMetadataCtor(props) {
        return function ctor() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (props) {
                var /** @type {?} */ values = props.apply(void 0, args);
                for (var /** @type {?} */ propName in values) {
                    this[propName] = values[propName];
                }
            }
        };
    }

    /**
     * @param {?} name
     * @param {?=} props
     * @param {?=} parentClass
     * @return {?}
     */
    function makeParamDecorator(name, props, parentClass) {
        var /** @type {?} */ metaCtor = makeMetadataCtor(props);

        /**
         * @param {...?} args
         * @return {?}
         */
        function ParamDecoratorFactory() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (this instanceof ParamDecoratorFactory) {
                metaCtor.apply(this, args);
                return this;
            }
            var /** @type {?} */ annotationInstance = new ((_a = ((ParamDecoratorFactory))).bind.apply(_a, [void 0].concat(args)))();
            ((ParamDecorator)).annotation = annotationInstance;
            return ParamDecorator;

            /**
             * @param {?} cls
             * @param {?} unusedKey
             * @param {?} index
             * @return {?}
             */
            function ParamDecorator(cls, unusedKey, index) {
                // Use of Object.defineProperty is important since it creates non-enumerable property which
                // prevents the property is copied during subclassing.
                var /** @type {?} */ parameters = cls.hasOwnProperty(PARAMETERS) ?
                    ((cls))[PARAMETERS] :
                    Object.defineProperty(cls, PARAMETERS, {value: []})[PARAMETERS];
                // there might be gaps if some in between parameters do not have annotations.
                // we pad with nulls.
                while (parameters.length <= index) {
                    parameters.push(null);
                }
                (parameters[index] = parameters[index] || []).push(annotationInstance);
                return cls;
            }

            var _a;
        }

        if (parentClass) {
            ParamDecoratorFactory.prototype = Object.create(parentClass.prototype);
        }
        ParamDecoratorFactory.prototype.ngMetadataName = name;
        ((ParamDecoratorFactory)).annotationCls = ParamDecoratorFactory;
        return ParamDecoratorFactory;
    }

    /**
     * @param {?} name
     * @param {?=} props
     * @param {?=} parentClass
     * @return {?}
     */
    function makePropDecorator(name, props, parentClass) {
        var /** @type {?} */ metaCtor = makeMetadataCtor(props);

        /**
         * @param {...?} args
         * @return {?}
         */
        function PropDecoratorFactory() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (this instanceof PropDecoratorFactory) {
                metaCtor.apply(this, args);
                return this;
            }
            var /** @type {?} */ decoratorInstance = new ((_a = ((PropDecoratorFactory))).bind.apply(_a, [void 0].concat(args)))();
            return function PropDecorator(target, name) {
                var /** @type {?} */ constructor = target.constructor;
                // Use of Object.defineProperty is important since it creates non-enumerable property which
                // prevents the property is copied during subclassing.
                var /** @type {?} */ meta = constructor.hasOwnProperty(PROP_METADATA) ?
                    ((constructor))[PROP_METADATA] :
                    Object.defineProperty(constructor, PROP_METADATA, {value: {}})[PROP_METADATA];
                meta[name] = meta.hasOwnProperty(name) && meta[name] || [];
                meta[name].unshift(decoratorInstance);
            };
            var _a;
        }

        if (parentClass) {
            PropDecoratorFactory.prototype = Object.create(parentClass.prototype);
        }
        PropDecoratorFactory.prototype.ngMetadataName = name;
        ((PropDecoratorFactory)).annotationCls = PropDecoratorFactory;
        return PropDecoratorFactory;
    }

    /**
     * Type of the Attribute decorator / constructor function.
     *
     * \@stable
     * @record
     */
    /**
     * Attribute decorator and metadata.
     *
     * \@stable
     * \@Annotation
     */
    var Attribute = /*@__PURE__*/ makeParamDecorator('Attribute', function (attributeName) {
        return ({attributeName: attributeName});
    });
    /**
     * Base class for query metadata.
     *
     * See {\@link ContentChildren}, {\@link ContentChild}, {\@link ViewChildren}, {\@link ViewChild} for
     * more information.
     *
     * \@stable
     * @abstract
     */
    var Query = /*@__PURE__*/ (/*@__PURE__*/ function () {
        function Query() {
        }

        return Query;
    }());
    /**
     * Type of the ContentChildren decorator / constructor function.
     *
     * See {\@link ContentChildren}.
     *
     * \@stable
     * @record
     */
    /**
     * ContentChildren decorator and metadata.
     *
     *  \@stable
     *  \@Annotation
     */
    var ContentChildren = /*@__PURE__*/ makePropDecorator('ContentChildren', function (selector, data) {
        if (data === void 0) {
            data = {};
        }
        return (__assign({selector: selector, first: false, isViewQuery: false, descendants: false}, data));
    }, Query);
    /**
     * Type of the ContentChild decorator / constructor function.
     *
     *
     * \@stable
     * @record
     */
    /**
     * ContentChild decorator and metadata.
     *
     * \@stable
     * \@Annotation
     */
    var ContentChild = /*@__PURE__*/ makePropDecorator('ContentChild', function (selector, data) {
        if (data === void 0) {
            data = {};
        }
        return (__assign({selector: selector, first: true, isViewQuery: false, descendants: true}, data));
    }, Query);
    /**
     * Type of the ViewChildren decorator / constructor function.
     *
     * See {\@link ViewChildren}.
     *
     * \@stable
     * @record
     */
    /**
     * ViewChildren decorator and metadata.
     *
     * \@stable
     * \@Annotation
     */
    var ViewChildren = /*@__PURE__*/ makePropDecorator('ViewChildren', function (selector, data) {
        if (data === void 0) {
            data = {};
        }
        return (__assign({selector: selector, first: false, isViewQuery: true, descendants: true}, data));
    }, Query);
    /**
     * Type of the ViewChild decorator / constructor function.
     *
     * See {\@link ViewChild}
     *
     * \@stable
     * @record
     */
    /**
     * ViewChild decorator and metadata.
     *
     * \@stable
     * \@Annotation
     */
    var ViewChild = /*@__PURE__*/ makePropDecorator('ViewChild', function (selector, data) {
        return (__assign({selector: selector, first: true, isViewQuery: true, descendants: true}, data));
    }, Query);
    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /** @enum {number} */
    var ChangeDetectionStrategy = /*@__PURE__*/ (function () {
        var ChangeDetectionStrategy = {
            /**
             * `OnPush` means that the change detector's mode will be initially set to `CheckOnce`.
             */
            OnPush: 0,
            /**
             * `Default` means that the change detector's mode will be initially set to `CheckAlways`.
             */
            Default: 1,
        };
        ChangeDetectionStrategy[ChangeDetectionStrategy.OnPush] = "OnPush";
        ChangeDetectionStrategy[ChangeDetectionStrategy.Default] = "Default";
        return ChangeDetectionStrategy;
    })();
    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * Type of the Directive decorator / constructor function.
     *
     * \@stable
     * @record
     */
    /**
     * Directive decorator and metadata.
     *
     * \@stable
     * \@Annotation
     */
    var Directive = /*@__PURE__*/ makeDecorator('Directive', function (dir) {
        if (dir === void 0) {
            dir = {};
        }
        return dir;
    });
    /**
     * Type of the Component decorator / constructor function.
     *
     * \@stable
     * @record
     */
    /**
     * Component decorator and metadata.
     *
     * \@stable
     * \@Annotation
     */
    var Component = /*@__PURE__*/ makeDecorator('Component', function (c) {
        if (c === void 0) {
            c = {};
        }
        return (__assign({changeDetection: ChangeDetectionStrategy.Default}, c));
    }, Directive);
    /**
     * Type of the Pipe decorator / constructor function.
     *
     * \@stable
     * @record
     */
    /**
     * Pipe decorator and metadata.
     *
     * Use the `\@Pipe` annotation to declare that a given class is a pipe. A pipe
     * class must also implement {\@link PipeTransform} interface.
     *
     * To use the pipe include a reference to the pipe class in
     * {\@link NgModule#declarations}.
     *
     * \@stable
     * \@Annotation
     */
    var Pipe = /*@__PURE__*/ makeDecorator('Pipe', function (p) {
        return (__assign({pure: true}, p));
    });
    /**
     * Type of the Input decorator / constructor function.
     *
     * \@stable
     * @record
     */
    /**
     * Input decorator and metadata.
     *
     * \@stable
     * \@Annotation
     */
    var Input = /*@__PURE__*/ makePropDecorator('Input', function (bindingPropertyName) {
        return ({bindingPropertyName: bindingPropertyName});
    });
    /**
     * Type of the Output decorator / constructor function.
     *
     * \@stable
     * @record
     */
    /**
     * Output decorator and metadata.
     *
     * \@stable
     * \@Annotation
     */
    var Output = /*@__PURE__*/ makePropDecorator('Output', function (bindingPropertyName) {
        return ({bindingPropertyName: bindingPropertyName});
    });
    /**
     * Type of the HostBinding decorator / constructor function.
     *
     * \@stable
     * @record
     */
    /**
     * HostBinding decorator and metadata.
     *
     * \@stable
     * \@Annotation
     */
    var HostBinding = /*@__PURE__*/ makePropDecorator('HostBinding', function (hostPropertyName) {
        return ({hostPropertyName: hostPropertyName});
    });
    /**
     * Type of the HostListener decorator / constructor function.
     *
     * \@stable
     * @record
     */
    /**
     * HostListener decorator and metadata.
     *
     * \@stable
     * \@Annotation
     */
    var HostListener = /*@__PURE__*/ makePropDecorator('HostListener', function (eventName, args) {
        return ({eventName: eventName, args: args});
    });
    /**
     * Type of the NgModule decorator / constructor function.
     *
     * \@stable
     * @record
     */
    /**
     * NgModule decorator and metadata.
     *
     * \@stable
     * \@Annotation
     */
    var NgModule = /*@__PURE__*/ makeDecorator('NgModule', function (ngModule) {
        return ngModule;
    });
    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /** @enum {number} */
    var ViewEncapsulation = /*@__PURE__*/ (function () {
        var ViewEncapsulation = {
            /**
             * Emulate `Native` scoping of styles by adding an attribute containing surrogate id to the Host
             * Element and pre-processing the style rules provided via {@link Component#styles styles} or
             * {@link Component#styleUrls styleUrls}, and adding the new Host Element attribute to all
             * selectors.
             *
             * This is the default option.
             */
            Emulated: 0,
            /**
             * Use the native encapsulation mechanism of the renderer.
             *
             * For the DOM this means using [Shadow DOM](https://w3c.github.io/webcomponents/spec/shadow/) and
             * creating a ShadowRoot for Component's Host Element.
             */
            Native: 1,
            /**
             * Don't provide any template or style encapsulation.
             */
            None: 2,
        };
        ViewEncapsulation[ViewEncapsulation.Emulated] = "Emulated";
        ViewEncapsulation[ViewEncapsulation.Native] = "Native";
        ViewEncapsulation[ViewEncapsulation.None] = "None";
        return ViewEncapsulation;
    })();
    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * \@whatItDoes Represents the version of Angular
     *
     * \@stable
     */
    var Version = /*@__PURE__*/ (/*@__PURE__*/ function () {
        function Version(full) {
            this.full = full;
            this.major = full.split('.')[0];
            this.minor = full.split('.')[1];
            this.patch = full.split('.').slice(2).join('.');
        }

        return Version;
    }());
    /**
     * \@stable
     */
    var VERSION = /*@__PURE__*/ new Version('6.0.0-beta.3-67cf712');
    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * Type of the Inject decorator / constructor function.
     *
     * \@stable
     * @record
     */
    /**
     * Inject decorator and metadata.
     *
     * \@stable
     * \@Annotation
     */
    var Inject = /*@__PURE__*/ makeParamDecorator('Inject', function (token) {
        return ({token: token});
    });
    /**
     * Type of the Optional decorator / constructor function.
     *
     * \@stable
     * @record
     */
    /**
     * Optional decorator and metadata.
     *
     * \@stable
     * \@Annotation
     */
    var Optional = /*@__PURE__*/ makeParamDecorator('Optional');
    /**
     * Type of the Injectable decorator / constructor function.
     *
     * \@stable
     * @record
     */
    /**
     * Injectable decorator and metadata.
     *
     * \@stable
     * \@Annotation
     */
    var Injectable = /*@__PURE__*/ makeDecorator('Injectable');
    /**
     * Type of the Self decorator / constructor function.
     *
     * \@stable
     * @record
     */
    /**
     * Self decorator and metadata.
     *
     * \@stable
     * \@Annotation
     */
    var Self = /*@__PURE__*/ makeParamDecorator('Self');
    /**
     * Type of the SkipSelf decorator / constructor function.
     *
     * \@stable
     * @record
     */
    /**
     * SkipSelf decorator and metadata.
     *
     * \@stable
     * \@Annotation
     */
    var SkipSelf = /*@__PURE__*/ makeParamDecorator('SkipSelf');
    /**
     * Type of the Host decorator / constructor function.
     *
     * \@stable
     * @record
     */
    /**
     * Host decorator and metadata.
     *
     * \@stable
     * \@Annotation
     */
    var Host = /*@__PURE__*/ makeParamDecorator('Host');
    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var __window$1 = typeof window !== 'undefined' && window;
    var __self$1 = typeof self !== 'undefined' && typeof WorkerGlobalScope !== 'undefined' &&
        self instanceof WorkerGlobalScope && self;
    var __global$1 = typeof global !== 'undefined' && global;
    var _global = __window$1 || __global$1 || __self$1;
    var promise = /*@__PURE__*/ Promise.resolve(0);
    var _symbolIterator = null;

    /**
     * @return {?}
     */
    function getSymbolIterator() {
        if (!_symbolIterator) {
            var /** @type {?} */ Symbol_1 = _global['Symbol'];
            if (Symbol_1 && Symbol_1.iterator) {
                _symbolIterator = Symbol_1.iterator;
            }
            else {
                // es6-shim specific logic
                var /** @type {?} */ keys = Object.getOwnPropertyNames(Map.prototype);
                for (var /** @type {?} */ i = 0; i < keys.length; ++i) {
                    var /** @type {?} */ key = keys[i];
                    if (key !== 'entries' && key !== 'size' &&
                        ((Map)).prototype[key] === Map.prototype['entries']) {
                        _symbolIterator = key;
                    }
                }
            }
        }
        return _symbolIterator;
    }

    /**
     * @param {?} fn
     * @return {?}
     */
    function scheduleMicroTask(fn) {
        if (typeof Zone === 'undefined') {
            // use promise to schedule microTask instead of use Zone
            promise.then(function () {
                fn && fn.apply(null, null);
            });
        }
        else {
            Zone.current.scheduleMicroTask('scheduleMicrotask', fn);
        }
    }

    /**
     * @param {?} a
     * @param {?} b
     * @return {?}
     */
    function looseIdentical(a, b) {
        return a === b || typeof a === 'number' && typeof b === 'number' && isNaN(a) && isNaN(b);
    }

    /**
     * @param {?} token
     * @return {?}
     */
    function stringify(token) {
        if (typeof token === 'string') {
            return token;
        }
        if (token instanceof Array) {
            return '[' + token.map(stringify).join(', ') + ']';
        }
        if (token == null) {
            return '' + token;
        }
        if (token.overriddenName) {
            return "" + token.overriddenName;
        }
        if (token.name) {
            return "" + token.name;
        }
        var /** @type {?} */ res = token.toString();
        if (res == null) {
            return '' + res;
        }
        var /** @type {?} */ newLineIndex = res.indexOf('\n');
        return newLineIndex === -1 ? res : res.substring(0, newLineIndex);
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */

    /**
     * An interface that a function passed into {\@link forwardRef} has to implement.
     *
     * ### Example
     *
     * {\@example core/di/ts/forward_ref/forward_ref_spec.ts region='forward_ref_fn'}
     * \@experimental
     * @record
     */
    /**
     * Allows to refer to references which are not yet defined.
     *
     * For instance, `forwardRef` is used when the `token` which we need to refer to for the purposes of
     * DI is declared,
     * but not yet defined. It is also used when the `token` which we use when creating a query is not
     * yet defined.
     *
     * ### Example
     * {\@example core/di/ts/forward_ref/forward_ref_spec.ts region='forward_ref'}
     * \@experimental
     * @param {?} forwardRefFn
     * @return {?}
     */
    function forwardRef(forwardRefFn) {
        ((forwardRefFn)).__forward_ref__ = forwardRef;
        ((forwardRefFn)).toString = function () {
            return stringify(this());
        };
        return (((forwardRefFn)));
    }

    /**
     * Lazily retrieves the reference value from a forwardRef.
     *
     * Acts as the identity function when given a non-forward-ref value.
     *
     * ### Example ([live demo](http://plnkr.co/edit/GU72mJrk1fiodChcmiDR?p=preview))
     *
     * {\@example core/di/ts/forward_ref/forward_ref_spec.ts region='resolve_forward_ref'}
     *
     * See: {\@link forwardRef}
     * \@experimental
     * @param {?} type
     * @return {?}
     */
    function resolveForwardRef(type) {
        if (typeof type === 'function' && type.hasOwnProperty('__forward_ref__') &&
            type.__forward_ref__ === forwardRef) {
            return ((type))();
        }
        else {
            return type;
        }
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var SOURCE = '__source';
    var _THROW_IF_NOT_FOUND = /*@__PURE__*/ new Object();
    var THROW_IF_NOT_FOUND = _THROW_IF_NOT_FOUND;
    var _NullInjector = /*@__PURE__*/ (/*@__PURE__*/ function () {
        function _NullInjector() {
        }

        /**
         * @param {?} token
         * @param {?=} notFoundValue
         * @return {?}
         */
        _NullInjector.prototype.get = /**
         * @param {?} token
         * @param {?=} notFoundValue
         * @return {?}
         */
        function (token, notFoundValue) {
            if (notFoundValue === void 0) {
                notFoundValue = _THROW_IF_NOT_FOUND;
            }
            if (notFoundValue === _THROW_IF_NOT_FOUND) {
                throw new Error("NullInjectorError: No provider for " + stringify(token) + "!");
            }
            return notFoundValue;
        };
        return _NullInjector;
    }());
    /**
     * \@whatItDoes Injector interface
     * \@howToUse
     * ```
     * const injector: Injector = ...;
     * injector.get(...);
     * ```
     *
     * \@description
     * For more details, see the {\@linkDocs guide/dependency-injection "Dependency Injection Guide"}.
     *
     * ### Example
     *
     * {\@example core/di/ts/injector_spec.ts region='Injector'}
     *
     * `Injector` returns itself when given `Injector` as a token:
     * {\@example core/di/ts/injector_spec.ts region='injectInjector'}
     *
     * \@stable
     * @abstract
     */
    var Injector = /*@__PURE__*/ (/*@__PURE__*/ function () {
        function Injector() {
        }

        /**
         * Create a new Injector which is configure using `StaticProvider`s.
         *
         * ### Example
         *
         * {@example core/di/ts/provider_spec.ts region='ConstructorProvider'}
         */
        /**
         * Create a new Injector which is configure using `StaticProvider`s.
         *
         * ### Example
         *
         * {\@example core/di/ts/provider_spec.ts region='ConstructorProvider'}
         * @param {?} options
         * @param {?=} parent
         * @return {?}
         */
        Injector.create = /**
         * Create a new Injector which is configure using `StaticProvider`s.
         *
         * ### Example
         *
         * {\@example core/di/ts/provider_spec.ts region='ConstructorProvider'}
         * @param {?} options
         * @param {?=} parent
         * @return {?}
         */
        function (options, parent) {
            if (Array.isArray(options)) {
                return new StaticInjector(options, parent);
            }
            else {
                return new StaticInjector(options.providers, options.parent, options.name || null);
            }
        };
        Injector.THROW_IF_NOT_FOUND = _THROW_IF_NOT_FOUND;
        Injector.NULL = new _NullInjector();
        return Injector;
    }());
    var IDENT = function (value) {
        return value;
    };
    var EMPTY = ([]);
    var CIRCULAR = IDENT;
    var MULTI_PROVIDER_FN = function () {
        return Array.prototype.slice.call(arguments);
    };
    var GET_PROPERTY_NAME = ({});
    var ɵ2 = GET_PROPERTY_NAME;
    var USE_VALUE = /*@__PURE__*/ getClosureSafeProperty({provide: String, useValue: ɵ2});
    var NG_TOKEN_PATH = 'ngTokenPath';
    var NG_TEMP_TOKEN_PATH = 'ngTempTokenPath';
    var NULL_INJECTOR = Injector.NULL;
    var NEW_LINE = /\n/gm;
    var NO_NEW_LINE = 'ɵ';
    var StaticInjector = /*@__PURE__*/ (/*@__PURE__*/ function () {
        function StaticInjector(providers, parent, source) {
            if (parent === void 0) {
                parent = NULL_INJECTOR;
            }
            if (source === void 0) {
                source = null;
            }
            this.parent = parent;
            this.source = source;
            var /** @type {?} */ records = this._records = new Map();
            records.set(Injector, /** @type {?} */ ({
                token: Injector,
                fn: IDENT,
                deps: EMPTY,
                value: this,
                useNew: false
            }));
            recursivelyProcessProviders(records, providers);
        }

        /**
         * @param {?} token
         * @param {?=} notFoundValue
         * @return {?}
         */
        StaticInjector.prototype.get = /**
         * @param {?} token
         * @param {?=} notFoundValue
         * @return {?}
         */
        function (token, notFoundValue) {
            var /** @type {?} */ record = this._records.get(token);
            try {
                return tryResolveToken(token, record, this._records, this.parent, notFoundValue);
            }
            catch (e) {
                var /** @type {?} */ tokenPath = e[NG_TEMP_TOKEN_PATH];
                if (token[SOURCE]) {
                    tokenPath.unshift(token[SOURCE]);
                }
                e.message = formatError('\n' + e.message, tokenPath, this.source);
                e[NG_TOKEN_PATH] = tokenPath;
                e[NG_TEMP_TOKEN_PATH] = null;
                throw e;
            }
        };
        /**
         * @return {?}
         */
        StaticInjector.prototype.toString = /**
         * @return {?}
         */
        function () {
            var /** @type {?} */ tokens = ([]), /** @type {?} */ records = this._records;
            records.forEach(function (v, token) {
                return tokens.push(stringify(token));
            });
            return "StaticInjector[" + tokens.join(', ') + "]";
        };
        return StaticInjector;
    }());

    /**
     * @param {?} provider
     * @return {?}
     */
    function resolveProvider(provider) {
        var /** @type {?} */ deps = computeDeps(provider);
        var /** @type {?} */ fn = IDENT;
        var /** @type {?} */ value = EMPTY;
        var /** @type {?} */ useNew = false;
        var /** @type {?} */ provide = resolveForwardRef(provider.provide);
        if (USE_VALUE in provider) {
            // We need to use USE_VALUE in provider since provider.useValue could be defined as undefined.
            value = ((provider)).useValue;
        }
        else if (((provider)).useFactory) {
            fn = ((provider)).useFactory;
        }
        else if (((provider)).useExisting) {
            // Just use IDENT
        }
        else if (((provider)).useClass) {
            useNew = true;
            fn = resolveForwardRef(((provider)).useClass);
        }
        else if (typeof provide == 'function') {
            useNew = true;
            fn = provide;
        }
        else {
            throw staticError('StaticProvider does not have [useValue|useFactory|useExisting|useClass] or [provide] is not newable', provider);
        }
        return {deps: deps, fn: fn, useNew: useNew, value: value};
    }

    /**
     * @param {?} token
     * @return {?}
     */
    function multiProviderMixError(token) {
        return staticError('Cannot mix multi providers and regular providers', token);
    }

    /**
     * @param {?} records
     * @param {?} provider
     * @return {?}
     */
    function recursivelyProcessProviders(records, provider) {
        if (provider) {
            provider = resolveForwardRef(provider);
            if (provider instanceof Array) {
                // if we have an array recurse into the array
                for (var /** @type {?} */ i = 0; i < provider.length; i++) {
                    recursivelyProcessProviders(records, provider[i]);
                }
            }
            else if (typeof provider === 'function') {
                // Functions were supported in ReflectiveInjector, but are not here. For safety give useful
                // error messages
                throw staticError('Function/Class not supported', provider);
            }
            else if (provider && typeof provider === 'object' && provider.provide) {
                // At this point we have what looks like a provider: {provide: ?, ....}
                var /** @type {?} */ token = resolveForwardRef(provider.provide);
                var /** @type {?} */ resolvedProvider = resolveProvider(provider);
                if (provider.multi === true) {
                    // This is a multi provider.
                    var /** @type {?} */ multiProvider = records.get(token);
                    if (multiProvider) {
                        if (multiProvider.fn !== MULTI_PROVIDER_FN) {
                            throw multiProviderMixError(token);
                        }
                    }
                    else {
                        // Create a placeholder factory which will look up the constituents of the multi provider.
                        records.set(token, multiProvider = /** @type {?} */ ({
                            token: provider.provide,
                            deps: [],
                            useNew: false,
                            fn: MULTI_PROVIDER_FN,
                            value: EMPTY
                        }));
                    }
                    // Treat the provider as the token.
                    token = provider;
                    multiProvider.deps.push({token: token, options: 6 /* Default */});
                }
                var /** @type {?} */ record = records.get(token);
                if (record && record.fn == MULTI_PROVIDER_FN) {
                    throw multiProviderMixError(token);
                }
                records.set(token, resolvedProvider);
            }
            else {
                throw staticError('Unexpected provider', provider);
            }
        }
    }

    /**
     * @param {?} token
     * @param {?} record
     * @param {?} records
     * @param {?} parent
     * @param {?} notFoundValue
     * @return {?}
     */
    function tryResolveToken(token, record, records, parent, notFoundValue) {
        try {
            return resolveToken(token, record, records, parent, notFoundValue);
        }
        catch (e) {
            // ensure that 'e' is of type Error.
            if (!(e instanceof Error)) {
                e = new Error(e);
            }
            var /** @type {?} */ path = e[NG_TEMP_TOKEN_PATH] = e[NG_TEMP_TOKEN_PATH] || [];
            path.unshift(token);
            if (record && record.value == CIRCULAR) {
                // Reset the Circular flag.
                record.value = EMPTY;
            }
            throw e;
        }
    }

    /**
     * @param {?} token
     * @param {?} record
     * @param {?} records
     * @param {?} parent
     * @param {?} notFoundValue
     * @return {?}
     */
    function resolveToken(token, record, records, parent, notFoundValue) {
        var /** @type {?} */ value;
        if (record) {
            // If we don't have a record, this implies that we don't own the provider hence don't know how
            // to resolve it.
            value = record.value;
            if (value == CIRCULAR) {
                throw Error(NO_NEW_LINE + 'Circular dependency');
            }
            else if (value === EMPTY) {
                record.value = CIRCULAR;
                var /** @type {?} */ obj = undefined;
                var /** @type {?} */ useNew = record.useNew;
                var /** @type {?} */ fn = record.fn;
                var /** @type {?} */ depRecords = record.deps;
                var /** @type {?} */ deps = EMPTY;
                if (depRecords.length) {
                    deps = [];
                    for (var /** @type {?} */ i = 0; i < depRecords.length; i++) {
                        var /** @type {?} */ depRecord = depRecords[i];
                        var /** @type {?} */ options = depRecord.options;
                        var /** @type {?} */ childRecord = options & 2 /* CheckSelf */ ? records.get(depRecord.token) : undefined;
                        deps.push(tryResolveToken(
                            // Current Token to resolve
                            depRecord.token, childRecord, records,
                            // If we don't know how to resolve dependency and we should not check parent for it,
                            // than pass in Null injector.
                            !childRecord && !(options & 4 /* CheckParent */) ? NULL_INJECTOR : parent, options & 1 /* Optional */ ? null : Injector.THROW_IF_NOT_FOUND));
                    }
                }
                record.value = value = useNew ? new ((_a = ((fn))).bind.apply(_a, [void 0].concat(deps)))() : fn.apply(obj, deps);
            }
        }
        else {
            value = parent.get(token, notFoundValue);
        }
        return value;
        var _a;
    }

    /**
     * @param {?} provider
     * @return {?}
     */
    function computeDeps(provider) {
        var /** @type {?} */ deps = EMPTY;
        var /** @type {?} */ providerDeps = ((provider)).deps;
        if (providerDeps && providerDeps.length) {
            deps = [];
            for (var /** @type {?} */ i = 0; i < providerDeps.length; i++) {
                var /** @type {?} */ options = 6;
                var /** @type {?} */ token = resolveForwardRef(providerDeps[i]);
                if (token instanceof Array) {
                    for (var /** @type {?} */ j = 0, /** @type {?} */ annotations = token; j < annotations.length; j++) {
                        var /** @type {?} */ annotation = annotations[j];
                        if (annotation instanceof Optional || annotation == Optional) {
                            options = options | 1 /* Optional */;
                        }
                        else if (annotation instanceof SkipSelf || annotation == SkipSelf) {
                            options = options & ~2 /* CheckSelf */;
                        }
                        else if (annotation instanceof Self || annotation == Self) {
                            options = options & ~4 /* CheckParent */;
                        }
                        else if (annotation instanceof Inject) {
                            token = ((annotation)).token;
                        }
                        else {
                            token = resolveForwardRef(annotation);
                        }
                    }
                }
                deps.push({token: token, options: options});
            }
        }
        else if (((provider)).useExisting) {
            var /** @type {?} */ token = resolveForwardRef(((provider)).useExisting);
            deps = [{token: token, options: 6 /* Default */}];
        }
        else if (!providerDeps && !(USE_VALUE in provider)) {
            // useValue & useExisting are the only ones which are exempt from deps all others need it.
            throw staticError('\'deps\' required', provider);
        }
        return deps;
    }

    /**
     * @param {?} text
     * @param {?} obj
     * @param {?=} source
     * @return {?}
     */
    function formatError(text, obj, source) {
        if (source === void 0) {
            source = null;
        }
        text = text && text.charAt(0) === '\n' && text.charAt(1) == NO_NEW_LINE ? text.substr(2) : text;
        var /** @type {?} */ context = stringify(obj);
        if (obj instanceof Array) {
            context = obj.map(stringify).join(' -> ');
        }
        else if (typeof obj === 'object') {
            var /** @type {?} */ parts = ([]);
            for (var /** @type {?} */ key in obj) {
                if (obj.hasOwnProperty(key)) {
                    var /** @type {?} */ value = obj[key];
                    parts.push(key + ':' + (typeof value === 'string' ? JSON.stringify(value) : stringify(value)));
                }
            }
            context = "{" + parts.join(', ') + "}";
        }
        return "StaticInjectorError" + (source ? '(' + source + ')' : '') + "[" + context + "]: " + text.replace(NEW_LINE, '\n  ');
    }

    /**
     * @param {?} text
     * @param {?} obj
     * @return {?}
     */
    function staticError(text, obj) {
        return new Error(formatError(text, obj));
    }

    /**
     * @template T
     * @param {?} objWithPropertyToExtract
     * @return {?}
     */
    function getClosureSafeProperty(objWithPropertyToExtract) {
        for (var /** @type {?} */ key in objWithPropertyToExtract) {
            if (objWithPropertyToExtract[key] === GET_PROPERTY_NAME) {
                return key;
            }
        }
        throw Error('!prop');
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var ERROR_DEBUG_CONTEXT = 'ngDebugContext';
    var ERROR_ORIGINAL_ERROR = 'ngOriginalError';
    var ERROR_LOGGER = 'ngErrorLogger';

    /**
     * @param {?} error
     * @return {?}
     */
    /**
     * @param {?} error
     * @return {?}
     */
    function getDebugContext(error) {
        return ((error))[ERROR_DEBUG_CONTEXT];
    }

    /**
     * @param {?} error
     * @return {?}
     */
    function getOriginalError(error) {
        return ((error))[ERROR_ORIGINAL_ERROR];
    }

    /**
     * @param {?} error
     * @return {?}
     */
    function getErrorLogger(error) {
        return ((error))[ERROR_LOGGER] || defaultErrorLogger;
    }

    /**
     * @param {?} console
     * @param {...?} values
     * @return {?}
     */
    function defaultErrorLogger(console) {
        var values = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            values[_i - 1] = arguments[_i];
        }
        console.error.apply(console, values);
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * \@whatItDoes Provides a hook for centralized exception handling.
     *
     * \@description
     *
     * The default implementation of `ErrorHandler` prints error messages to the `console`. To
     * intercept error handling, write a custom exception handler that replaces this default as
     * appropriate for your app.
     *
     * ### Example
     *
     * ```
     * class MyErrorHandler implements ErrorHandler {
     *   handleError(error) {
     *     // do something with the exception
     *   }
     * }
     *
     * \@NgModule({
     *   providers: [{provide: ErrorHandler, useClass: MyErrorHandler}]
     * })
     * class MyModule {}
     * ```
     *
     * \@stable
     */
    var ErrorHandler = /*@__PURE__*/ (/*@__PURE__*/ function () {
        function ErrorHandler() {
            /**
             * \@internal
             */
            this._console = console;
        }

        /**
         * @param {?} error
         * @return {?}
         */
        ErrorHandler.prototype.handleError = /**
         * @param {?} error
         * @return {?}
         */
        function (error) {
            var /** @type {?} */ originalError = this._findOriginalError(error);
            var /** @type {?} */ context = this._findContext(error);
            // Note: Browser consoles show the place from where console.error was called.
            // We can use this to give users additional information about the error.
            var /** @type {?} */ errorLogger = getErrorLogger(error);
            errorLogger(this._console, "ERROR", error);
            if (originalError) {
                errorLogger(this._console, "ORIGINAL ERROR", originalError);
            }
            if (context) {
                errorLogger(this._console, 'ERROR CONTEXT', context);
            }
        };
        /** @internal */
        /**
         * \@internal
         * @param {?} error
         * @return {?}
         */
        ErrorHandler.prototype._findContext = /**
         * \@internal
         * @param {?} error
         * @return {?}
         */
        function (error) {
            if (error) {
                return getDebugContext(error) ? getDebugContext(error) :
                    this._findContext(getOriginalError(error));
            }
            return null;
        };
        /** @internal */
        /**
         * \@internal
         * @param {?} error
         * @return {?}
         */
        ErrorHandler.prototype._findOriginalError = /**
         * \@internal
         * @param {?} error
         * @return {?}
         */
        function (error) {
            var /** @type {?} */ e = getOriginalError(error);
            while (e && getOriginalError(e)) {
                e = getOriginalError(e);
            }
            return e;
        };
        return ErrorHandler;
    }());

    /**
     * @param {?} message
     * @param {?} originalError
     * @return {?}
     */
    function wrappedError(message, originalError) {
        var /** @type {?} */ msg = message + " caused by: " + (originalError instanceof Error ? originalError.message : originalError);
        var /** @type {?} */ error = Error(msg);
        ((error))[ERROR_ORIGINAL_ERROR] = originalError;
        return error;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */

    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * @param {?} keys
     * @return {?}
     */
    function findFirstClosedCycle(keys) {
        var /** @type {?} */ res = [];
        for (var /** @type {?} */ i = 0; i < keys.length; ++i) {
            if (res.indexOf(keys[i]) > -1) {
                res.push(keys[i]);
                return res;
            }
            res.push(keys[i]);
        }
        return res;
    }

    /**
     * @param {?} keys
     * @return {?}
     */
    function constructResolvingPath(keys) {
        if (keys.length > 1) {
            var /** @type {?} */ reversed = findFirstClosedCycle(keys.slice().reverse());
            var /** @type {?} */ tokenStrs = reversed.map(function (k) {
                return stringify(k.token);
            });
            return ' (' + tokenStrs.join(' -> ') + ')';
        }
        return '';
    }

    /**
     * @record
     */
    /**
     * @param {?} injector
     * @param {?} key
     * @param {?} constructResolvingMessage
     * @param {?=} originalError
     * @return {?}
     */
    function injectionError(injector, key, constructResolvingMessage, originalError) {
        var /** @type {?} */ keys = [key];
        var /** @type {?} */ errMsg = constructResolvingMessage(keys);
        var /** @type {?} */ error = ((originalError ? wrappedError(errMsg, originalError) : Error(errMsg)));
        error.addKey = addKey;
        error.keys = keys;
        error.injectors = [injector];
        error.constructResolvingMessage = constructResolvingMessage;
        ((error))[ERROR_ORIGINAL_ERROR] = originalError;
        return error;
    }

    /**
     * @this {?}
     * @param {?} injector
     * @param {?} key
     * @return {?}
     */
    function addKey(injector, key) {
        this.injectors.push(injector);
        this.keys.push(key);
        // Note: This updated message won't be reflected in the `.stack` property
        this.message = this.constructResolvingMessage(this.keys);
    }

    /**
     * Thrown when trying to retrieve a dependency by key from {\@link Injector}, but the
     * {\@link Injector} does not have a {\@link Provider} for the given key.
     *
     * ### Example ([live demo](http://plnkr.co/edit/vq8D3FRB9aGbnWJqtEPE?p=preview))
     *
     * ```typescript
     * class A {
     *   constructor(b:B) {}
     * }
     *
     * expect(() => Injector.resolveAndCreate([A])).toThrowError();
     * ```
     * @param {?} injector
     * @param {?} key
     * @return {?}
     */
    function noProviderError(injector, key) {
        return injectionError(injector, key, function (keys) {
            var /** @type {?} */ first = stringify(keys[0].token);
            return "No provider for " + first + "!" + constructResolvingPath(keys);
        });
    }

    /**
     * Thrown when dependencies form a cycle.
     *
     * ### Example ([live demo](http://plnkr.co/edit/wYQdNos0Tzql3ei1EV9j?p=info))
     *
     * ```typescript
     * var injector = Injector.resolveAndCreate([
     *   {provide: "one", useFactory: (two) => "two", deps: [[new Inject("two")]]},
     *   {provide: "two", useFactory: (one) => "one", deps: [[new Inject("one")]]}
     * ]);
     *
     * expect(() => injector.get("one")).toThrowError();
     * ```
     *
     * Retrieving `A` or `B` throws a `CyclicDependencyError` as the graph above cannot be constructed.
     * @param {?} injector
     * @param {?} key
     * @return {?}
     */
    function cyclicDependencyError(injector, key) {
        return injectionError(injector, key, function (keys) {
            return "Cannot instantiate cyclic dependency!" + constructResolvingPath(keys);
        });
    }

    /**
     * Thrown when a constructing type returns with an Error.
     *
     * The `InstantiationError` class contains the original error plus the dependency graph which caused
     * this object to be instantiated.
     *
     * ### Example ([live demo](http://plnkr.co/edit/7aWYdcqTQsP0eNqEdUAf?p=preview))
     *
     * ```typescript
     * class A {
     *   constructor() {
     *     throw new Error('message');
     *   }
     * }
     *
     * var injector = Injector.resolveAndCreate([A]);
     * try {
     *   injector.get(A);
     * } catch (e) {
     *   expect(e instanceof InstantiationError).toBe(true);
     *   expect(e.originalException.message).toEqual("message");
     *   expect(e.originalStack).toBeDefined();
     * }
     * ```
     * @param {?} injector
     * @param {?} originalException
     * @param {?} originalStack
     * @param {?} key
     * @return {?}
     */
    function instantiationError(injector, originalException, originalStack, key) {
        return injectionError(injector, key, function (keys) {
            var /** @type {?} */ first = stringify(keys[0].token);
            return originalException.message + ": Error during instantiation of " + first + "!" + constructResolvingPath(keys) + ".";
        }, originalException);
    }

    /**
     * Thrown when an object other then {\@link Provider} (or `Type`) is passed to {\@link Injector}
     * creation.
     *
     * ### Example ([live demo](http://plnkr.co/edit/YatCFbPAMCL0JSSQ4mvH?p=preview))
     *
     * ```typescript
     * expect(() => Injector.resolveAndCreate(["not a type"])).toThrowError();
     * ```
     * @param {?} provider
     * @return {?}
     */
    function invalidProviderError(provider) {
        return Error("Invalid provider - only instances of Provider and Type are allowed, got: " + provider);
    }

    /**
     * Thrown when the class has no annotation information.
     *
     * Lack of annotation information prevents the {\@link Injector} from determining which dependencies
     * need to be injected into the constructor.
     *
     * ### Example ([live demo](http://plnkr.co/edit/rHnZtlNS7vJOPQ6pcVkm?p=preview))
     *
     * ```typescript
     * class A {
     *   constructor(b) {}
     * }
     *
     * expect(() => Injector.resolveAndCreate([A])).toThrowError();
     * ```
     *
     * This error is also thrown when the class not marked with {\@link Injectable} has parameter types.
     *
     * ```typescript
     * class B {}
     *
     * class A {
     *   constructor(b:B) {} // no information about the parameter types of A is available at runtime.
     * }
     *
     * expect(() => Injector.resolveAndCreate([A,B])).toThrowError();
     * ```
     * \@stable
     * @param {?} typeOrFunc
     * @param {?} params
     * @return {?}
     */
    function noAnnotationError(typeOrFunc, params) {
        var /** @type {?} */ signature = [];
        for (var /** @type {?} */ i = 0, /** @type {?} */ ii = params.length; i < ii; i++) {
            var /** @type {?} */ parameter = params[i];
            if (!parameter || parameter.length == 0) {
                signature.push('?');
            }
            else {
                signature.push(parameter.map(stringify).join(' '));
            }
        }
        return Error('Cannot resolve all parameters for \'' + stringify(typeOrFunc) + '\'(' +
            signature.join(', ') + '). ' +
            'Make sure that all the parameters are decorated with Inject or have valid type annotations and that \'' +
            stringify(typeOrFunc) + '\' is decorated with Injectable.');
    }

    /**
     * Thrown when getting an object by index.
     *
     * ### Example ([live demo](http://plnkr.co/edit/bRs0SX2OTQiJzqvjgl8P?p=preview))
     *
     * ```typescript
     * class A {}
     *
     * var injector = Injector.resolveAndCreate([A]);
     *
     * expect(() => injector.getAt(100)).toThrowError();
     * ```
     * \@stable
     * @param {?} index
     * @return {?}
     */
    function outOfBoundsError(index) {
        return Error("Index " + index + " is out-of-bounds.");
    }

    /**
     * Thrown when a multi provider and a regular provider are bound to the same token.
     *
     * ### Example
     *
     * ```typescript
     * expect(() => Injector.resolveAndCreate([
     *   { provide: "Strings", useValue: "string1", multi: true},
     *   { provide: "Strings", useValue: "string2", multi: false}
     * ])).toThrowError();
     * ```
     * @param {?} provider1
     * @param {?} provider2
     * @return {?}
     */
    function mixingMultiProvidersWithRegularProvidersError(provider1, provider2) {
        return Error("Cannot mix multi providers and regular providers, got: " + provider1 + " " + provider2);
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * A unique object used for retrieving items from the {\@link ReflectiveInjector}.
     *
     * Keys have:
     * - a system-wide unique `id`.
     * - a `token`.
     *
     * `Key` is used internally by {\@link ReflectiveInjector} because its system-wide unique `id` allows
     * the
     * injector to store created objects in a more efficient way.
     *
     * `Key` should not be created directly. {\@link ReflectiveInjector} creates keys automatically when
     * resolving
     * providers.
     * @deprecated No replacement
     */
    var ReflectiveKey = /*@__PURE__*/ (/*@__PURE__*/ function () {
        /**
         * Private
         */
        function ReflectiveKey(token, id) {
            this.token = token;
            this.id = id;
            if (!token) {
                throw new Error('Token must be defined!');
            }
            this.displayName = stringify(this.token);
        }

        /**
         * Retrieves a `Key` for a token.
         */
        /**
         * Retrieves a `Key` for a token.
         * @param {?} token
         * @return {?}
         */
        ReflectiveKey.get = /**
         * Retrieves a `Key` for a token.
         * @param {?} token
         * @return {?}
         */
        function (token) {
            return _globalKeyRegistry.get(resolveForwardRef(token));
        };
        Object.defineProperty(ReflectiveKey, "numberOfKeys", {
            /**
             * @returns the number of keys registered in the system.
             */
            get: /**
             * @return {?} the number of keys registered in the system.
             */ function () {
                return _globalKeyRegistry.numberOfKeys;
            },
            enumerable: true,
            configurable: true
        });
        return ReflectiveKey;
    }());
    var KeyRegistry = /*@__PURE__*/ (/*@__PURE__*/ function () {
        function KeyRegistry() {
            this._allKeys = new Map();
        }

        /**
         * @param {?} token
         * @return {?}
         */
        KeyRegistry.prototype.get = /**
         * @param {?} token
         * @return {?}
         */
        function (token) {
            if (token instanceof ReflectiveKey)
                return token;
            if (this._allKeys.has(token)) {
                return /** @type {?} */ ((this._allKeys.get(token)));
            }
            var /** @type {?} */ newKey = new ReflectiveKey(token, ReflectiveKey.numberOfKeys);
            this._allKeys.set(token, newKey);
            return newKey;
        };
        Object.defineProperty(KeyRegistry.prototype, "numberOfKeys", {
            get: /**
             * @return {?}
             */ function () {
                return this._allKeys.size;
            },
            enumerable: true,
            configurable: true
        });
        return KeyRegistry;
    }());
    var _globalKeyRegistry = /*@__PURE__*/ new KeyRegistry();
    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * \@whatItDoes Represents a type that a Component or other object is instances of.
     *
     * \@description
     *
     * An example of a `Type` is `MyCustomComponent` class, which in JavaScript is be represented by
     * the `MyCustomComponent` constructor function.
     *
     * \@stable
     */
    var Type = Function;

    /**
     * @param {?} v
     * @return {?}
     */
    function isType(v) {
        return typeof v === 'function';
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * Attention: This regex has to hold even if the code is minified!
     */
    var DELEGATE_CTOR = /^function\s+\S+\(\)\s*{[\s\S]+\.apply\(this,\s*arguments\)/;
    var ReflectionCapabilities = /*@__PURE__*/ (/*@__PURE__*/ function () {
        function ReflectionCapabilities(reflect) {
            this._reflect = reflect || _global['Reflect'];
        }

        /**
         * @return {?}
         */
        ReflectionCapabilities.prototype.isReflectionEnabled = /**
         * @return {?}
         */
        function () {
            return true;
        };
        /**
         * @template T
         * @param {?} t
         * @return {?}
         */
        ReflectionCapabilities.prototype.factory = /**
         * @template T
         * @param {?} t
         * @return {?}
         */
        function (t) {
            return function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return new (t.bind.apply(t, [void 0].concat(args)))();
            };
        };
        /** @internal */
        /**
         * \@internal
         * @param {?} paramTypes
         * @param {?} paramAnnotations
         * @return {?}
         */
        ReflectionCapabilities.prototype._zipTypesAndAnnotations = /**
         * \@internal
         * @param {?} paramTypes
         * @param {?} paramAnnotations
         * @return {?}
         */
        function (paramTypes, paramAnnotations) {
            var /** @type {?} */ result;
            if (typeof paramTypes === 'undefined') {
                result = new Array(paramAnnotations.length);
            }
            else {
                result = new Array(paramTypes.length);
            }
            for (var /** @type {?} */ i = 0; i < result.length; i++) {
                // TS outputs Object for parameters without types, while Traceur omits
                // the annotations. For now we preserve the Traceur behavior to aid
                // migration, but this can be revisited.
                if (typeof paramTypes === 'undefined') {
                    result[i] = [];
                }
                else if (paramTypes[i] != Object) {
                    result[i] = [paramTypes[i]];
                }
                else {
                    result[i] = [];
                }
                if (paramAnnotations && paramAnnotations[i] != null) {
                    result[i] = result[i].concat(paramAnnotations[i]);
                }
            }
            return result;
        };
        /**
         * @param {?} type
         * @param {?} parentCtor
         * @return {?}
         */
        ReflectionCapabilities.prototype._ownParameters = /**
         * @param {?} type
         * @param {?} parentCtor
         * @return {?}
         */
        function (type, parentCtor) {
            // If we have no decorators, we only have function.length as metadata.
            // In that case, to detect whether a child class declared an own constructor or not,
            // we need to look inside of that constructor to check whether it is
            // just calling the parent.
            // This also helps to work around for https://github.com/Microsoft/TypeScript/issues/12439
            // that sets 'design:paramtypes' to []
            // if a class inherits from another class but has no ctor declared itself.
            if (DELEGATE_CTOR.exec(type.toString())) {
                return null;
            }
            // Prefer the direct API.
            if (((type)).parameters && ((type)).parameters !== parentCtor.parameters) {
                return ((type)).parameters;
            }
            // API of tsickle for lowering decorators to properties on the class.
            var /** @type {?} */ tsickleCtorParams = ((type)).ctorParameters;
            if (tsickleCtorParams && tsickleCtorParams !== parentCtor.ctorParameters) {
                // Newer tsickle uses a function closure
                // Retain the non-function case for compatibility with older tsickle
                var /** @type {?} */ ctorParameters = typeof tsickleCtorParams === 'function' ? tsickleCtorParams() : tsickleCtorParams;
                var /** @type {?} */ paramTypes_1 = ctorParameters.map(function (ctorParam) {
                    return ctorParam && ctorParam.type;
                });
                var /** @type {?} */ paramAnnotations_1 = ctorParameters.map(function (ctorParam) {
                    return ctorParam && convertTsickleDecoratorIntoMetadata(ctorParam.decorators);
                });
                return this._zipTypesAndAnnotations(paramTypes_1, paramAnnotations_1);
            }
            // API for metadata created by invoking the decorators.
            var /** @type {?} */ paramAnnotations = type.hasOwnProperty(PARAMETERS) && ((type))[PARAMETERS];
            var /** @type {?} */ paramTypes = this._reflect && this._reflect.getOwnMetadata &&
                this._reflect.getOwnMetadata('design:paramtypes', type);
            if (paramTypes || paramAnnotations) {
                return this._zipTypesAndAnnotations(paramTypes, paramAnnotations);
            }
            // If a class has no decorators, at least create metadata
            // based on function.length.
            // Note: We know that this is a real constructor as we checked
            // the content of the constructor above.
            return new Array(((type.length))).fill(undefined);
        };
        /**
         * @param {?} type
         * @return {?}
         */
        ReflectionCapabilities.prototype.parameters = /**
         * @param {?} type
         * @return {?}
         */
        function (type) {
            // Note: only report metadata if we have at least one class decorator
            // to stay in sync with the static reflector.
            if (!isType(type)) {
                return [];
            }
            var /** @type {?} */ parentCtor = getParentCtor(type);
            var /** @type {?} */ parameters = this._ownParameters(type, parentCtor);
            if (!parameters && parentCtor !== Object) {
                parameters = this.parameters(parentCtor);
            }
            return parameters || [];
        };
        /**
         * @param {?} typeOrFunc
         * @param {?} parentCtor
         * @return {?}
         */
        ReflectionCapabilities.prototype._ownAnnotations = /**
         * @param {?} typeOrFunc
         * @param {?} parentCtor
         * @return {?}
         */
        function (typeOrFunc, parentCtor) {
            // Prefer the direct API.
            if (((typeOrFunc)).annotations && ((typeOrFunc)).annotations !== parentCtor.annotations) {
                var /** @type {?} */ annotations = ((typeOrFunc)).annotations;
                if (typeof annotations === 'function' && annotations.annotations) {
                    annotations = annotations.annotations;
                }
                return annotations;
            }
            // API of tsickle for lowering decorators to properties on the class.
            if (((typeOrFunc)).decorators && ((typeOrFunc)).decorators !== parentCtor.decorators) {
                return convertTsickleDecoratorIntoMetadata(((typeOrFunc)).decorators);
            }
            // API for metadata created by invoking the decorators.
            if (typeOrFunc.hasOwnProperty(ANNOTATIONS)) {
                return ((typeOrFunc))[ANNOTATIONS];
            }
            return null;
        };
        /**
         * @param {?} typeOrFunc
         * @return {?}
         */
        ReflectionCapabilities.prototype.annotations = /**
         * @param {?} typeOrFunc
         * @return {?}
         */
        function (typeOrFunc) {
            if (!isType(typeOrFunc)) {
                return [];
            }
            var /** @type {?} */ parentCtor = getParentCtor(typeOrFunc);
            var /** @type {?} */ ownAnnotations = this._ownAnnotations(typeOrFunc, parentCtor) || [];
            var /** @type {?} */ parentAnnotations = parentCtor !== Object ? this.annotations(parentCtor) : [];
            return parentAnnotations.concat(ownAnnotations);
        };
        /**
         * @param {?} typeOrFunc
         * @param {?} parentCtor
         * @return {?}
         */
        ReflectionCapabilities.prototype._ownPropMetadata = /**
         * @param {?} typeOrFunc
         * @param {?} parentCtor
         * @return {?}
         */
        function (typeOrFunc, parentCtor) {
            // Prefer the direct API.
            if (((typeOrFunc)).propMetadata &&
                ((typeOrFunc)).propMetadata !== parentCtor.propMetadata) {
                var /** @type {?} */ propMetadata = ((typeOrFunc)).propMetadata;
                if (typeof propMetadata === 'function' && propMetadata.propMetadata) {
                    propMetadata = propMetadata.propMetadata;
                }
                return propMetadata;
            }
            // API of tsickle for lowering decorators to properties on the class.
            if (((typeOrFunc)).propDecorators &&
                ((typeOrFunc)).propDecorators !== parentCtor.propDecorators) {
                var /** @type {?} */ propDecorators_1 = ((typeOrFunc)).propDecorators;
                var /** @type {?} */ propMetadata_1 = ({});
                Object.keys(propDecorators_1).forEach(function (prop) {
                    propMetadata_1[prop] = convertTsickleDecoratorIntoMetadata(propDecorators_1[prop]);
                });
                return propMetadata_1;
            }
            // API for metadata created by invoking the decorators.
            if (typeOrFunc.hasOwnProperty(PROP_METADATA)) {
                return ((typeOrFunc))[PROP_METADATA];
            }
            return null;
        };
        /**
         * @param {?} typeOrFunc
         * @return {?}
         */
        ReflectionCapabilities.prototype.propMetadata = /**
         * @param {?} typeOrFunc
         * @return {?}
         */
        function (typeOrFunc) {
            if (!isType(typeOrFunc)) {
                return {};
            }
            var /** @type {?} */ parentCtor = getParentCtor(typeOrFunc);
            var /** @type {?} */ propMetadata = {};
            if (parentCtor !== Object) {
                var /** @type {?} */ parentPropMetadata_1 = this.propMetadata(parentCtor);
                Object.keys(parentPropMetadata_1).forEach(function (propName) {
                    propMetadata[propName] = parentPropMetadata_1[propName];
                });
            }
            var /** @type {?} */ ownPropMetadata = this._ownPropMetadata(typeOrFunc, parentCtor);
            if (ownPropMetadata) {
                Object.keys(ownPropMetadata).forEach(function (propName) {
                    var /** @type {?} */ decorators = [];
                    if (propMetadata.hasOwnProperty(propName)) {
                        decorators.push.apply(decorators, propMetadata[propName]);
                    }
                    decorators.push.apply(decorators, ownPropMetadata[propName]);
                    propMetadata[propName] = decorators;
                });
            }
            return propMetadata;
        };
        /**
         * @param {?} type
         * @param {?} lcProperty
         * @return {?}
         */
        ReflectionCapabilities.prototype.hasLifecycleHook = /**
         * @param {?} type
         * @param {?} lcProperty
         * @return {?}
         */
        function (type, lcProperty) {
            return type instanceof Type && lcProperty in type.prototype;
        };
        /**
         * @param {?} type
         * @return {?}
         */
        ReflectionCapabilities.prototype.guards = /**
         * @param {?} type
         * @return {?}
         */
        function (type) {
            return {};
        };
        /**
         * @param {?} name
         * @return {?}
         */
        ReflectionCapabilities.prototype.getter = /**
         * @param {?} name
         * @return {?}
         */
        function (name) {
            return /** @type {?} */ (new Function('o', 'return o.' + name + ';'));
        };
        /**
         * @param {?} name
         * @return {?}
         */
        ReflectionCapabilities.prototype.setter = /**
         * @param {?} name
         * @return {?}
         */
        function (name) {
            return /** @type {?} */ (new Function('o', 'v', 'return o.' + name + ' = v;'));
        };
        /**
         * @param {?} name
         * @return {?}
         */
        ReflectionCapabilities.prototype.method = /**
         * @param {?} name
         * @return {?}
         */
        function (name) {
            var /** @type {?} */ functionBody = "if (!o." + name + ") throw new Error('\"" + name + "\" is undefined');\n        return o." + name + ".apply(o, args);";
            return /** @type {?} */ (new Function('o', 'args', functionBody));
        };
        // There is not a concept of import uri in Js, but this is useful in developing Dart applications.
        /**
         * @param {?} type
         * @return {?}
         */
        ReflectionCapabilities.prototype.importUri = /**
         * @param {?} type
         * @return {?}
         */
        function (type) {
            // StaticSymbol
            if (typeof type === 'object' && type['filePath']) {
                return type['filePath'];
            }
            // Runtime type
            return "./" + stringify(type);
        };
        /**
         * @param {?} type
         * @return {?}
         */
        ReflectionCapabilities.prototype.resourceUri = /**
         * @param {?} type
         * @return {?}
         */
        function (type) {
            return "./" + stringify(type);
        };
        /**
         * @param {?} name
         * @param {?} moduleUrl
         * @param {?} members
         * @param {?} runtime
         * @return {?}
         */
        ReflectionCapabilities.prototype.resolveIdentifier = /**
         * @param {?} name
         * @param {?} moduleUrl
         * @param {?} members
         * @param {?} runtime
         * @return {?}
         */
        function (name, moduleUrl, members, runtime) {
            return runtime;
        };
        /**
         * @param {?} enumIdentifier
         * @param {?} name
         * @return {?}
         */
        ReflectionCapabilities.prototype.resolveEnum = /**
         * @param {?} enumIdentifier
         * @param {?} name
         * @return {?}
         */
        function (enumIdentifier, name) {
            return enumIdentifier[name];
        };
        return ReflectionCapabilities;
    }());

    /**
     * @param {?} decoratorInvocations
     * @return {?}
     */
    function convertTsickleDecoratorIntoMetadata(decoratorInvocations) {
        if (!decoratorInvocations) {
            return [];
        }
        return decoratorInvocations.map(function (decoratorInvocation) {
            var /** @type {?} */ decoratorType = decoratorInvocation.type;
            var /** @type {?} */ annotationCls = decoratorType.annotationCls;
            var /** @type {?} */ annotationArgs = decoratorInvocation.args ? decoratorInvocation.args : [];
            return new (annotationCls.bind.apply(annotationCls, [void 0].concat(annotationArgs)))();
        });
    }

    /**
     * @param {?} ctor
     * @return {?}
     */
    function getParentCtor(ctor) {
        var /** @type {?} */ parentProto = Object.getPrototypeOf(ctor.prototype);
        var /** @type {?} */ parentCtor = parentProto ? parentProto.constructor : null;
        // Note: We always use `Object` as the null value
        // to simplify checking later on.
        return parentCtor || Object;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * Provides access to reflection data about symbols. Used internally by Angular
     * to power dependency injection and compilation.
     */
    var Reflector = /*@__PURE__*/ (/*@__PURE__*/ function () {
        function Reflector(reflectionCapabilities) {
            this.reflectionCapabilities = reflectionCapabilities;
        }

        /**
         * @param {?} caps
         * @return {?}
         */
        Reflector.prototype.updateCapabilities = /**
         * @param {?} caps
         * @return {?}
         */
        function (caps) {
            this.reflectionCapabilities = caps;
        };
        /**
         * @param {?} type
         * @return {?}
         */
        Reflector.prototype.factory = /**
         * @param {?} type
         * @return {?}
         */
        function (type) {
            return this.reflectionCapabilities.factory(type);
        };
        /**
         * @param {?} typeOrFunc
         * @return {?}
         */
        Reflector.prototype.parameters = /**
         * @param {?} typeOrFunc
         * @return {?}
         */
        function (typeOrFunc) {
            return this.reflectionCapabilities.parameters(typeOrFunc);
        };
        /**
         * @param {?} typeOrFunc
         * @return {?}
         */
        Reflector.prototype.annotations = /**
         * @param {?} typeOrFunc
         * @return {?}
         */
        function (typeOrFunc) {
            return this.reflectionCapabilities.annotations(typeOrFunc);
        };
        /**
         * @param {?} typeOrFunc
         * @return {?}
         */
        Reflector.prototype.propMetadata = /**
         * @param {?} typeOrFunc
         * @return {?}
         */
        function (typeOrFunc) {
            return this.reflectionCapabilities.propMetadata(typeOrFunc);
        };
        /**
         * @param {?} type
         * @param {?} lcProperty
         * @return {?}
         */
        Reflector.prototype.hasLifecycleHook = /**
         * @param {?} type
         * @param {?} lcProperty
         * @return {?}
         */
        function (type, lcProperty) {
            return this.reflectionCapabilities.hasLifecycleHook(type, lcProperty);
        };
        /**
         * @param {?} name
         * @return {?}
         */
        Reflector.prototype.getter = /**
         * @param {?} name
         * @return {?}
         */
        function (name) {
            return this.reflectionCapabilities.getter(name);
        };
        /**
         * @param {?} name
         * @return {?}
         */
        Reflector.prototype.setter = /**
         * @param {?} name
         * @return {?}
         */
        function (name) {
            return this.reflectionCapabilities.setter(name);
        };
        /**
         * @param {?} name
         * @return {?}
         */
        Reflector.prototype.method = /**
         * @param {?} name
         * @return {?}
         */
        function (name) {
            return this.reflectionCapabilities.method(name);
        };
        /**
         * @param {?} type
         * @return {?}
         */
        Reflector.prototype.importUri = /**
         * @param {?} type
         * @return {?}
         */
        function (type) {
            return this.reflectionCapabilities.importUri(type);
        };
        /**
         * @param {?} type
         * @return {?}
         */
        Reflector.prototype.resourceUri = /**
         * @param {?} type
         * @return {?}
         */
        function (type) {
            return this.reflectionCapabilities.resourceUri(type);
        };
        /**
         * @param {?} name
         * @param {?} moduleUrl
         * @param {?} members
         * @param {?} runtime
         * @return {?}
         */
        Reflector.prototype.resolveIdentifier = /**
         * @param {?} name
         * @param {?} moduleUrl
         * @param {?} members
         * @param {?} runtime
         * @return {?}
         */
        function (name, moduleUrl, members, runtime) {
            return this.reflectionCapabilities.resolveIdentifier(name, moduleUrl, members, runtime);
        };
        /**
         * @param {?} identifier
         * @param {?} name
         * @return {?}
         */
        Reflector.prototype.resolveEnum = /**
         * @param {?} identifier
         * @param {?} name
         * @return {?}
         */
        function (identifier, name) {
            return this.reflectionCapabilities.resolveEnum(identifier, name);
        };
        return Reflector;
    }());
    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * The {\@link Reflector} used internally in Angular to access metadata
     * about symbols.
     */
    var reflector = /*@__PURE__*/ new Reflector(/*@__PURE__*/ new ReflectionCapabilities());
    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * `Dependency` is used by the framework to extend DI.
     * This is internal to Angular and should not be used directly.
     */
    var ReflectiveDependency = /*@__PURE__*/ (/*@__PURE__*/ function () {
        function ReflectiveDependency(key, optional, visibility) {
            this.key = key;
            this.optional = optional;
            this.visibility = visibility;
        }

        /**
         * @param {?} key
         * @return {?}
         */
        ReflectiveDependency.fromKey = /**
         * @param {?} key
         * @return {?}
         */
        function (key) {
            return new ReflectiveDependency(key, false, null);
        };
        return ReflectiveDependency;
    }());
    var _EMPTY_LIST = [];
    /**
     * An internal resolved representation of a {\@link Provider} used by the {\@link Injector}.
     *
     * It is usually created automatically by `Injector.resolveAndCreate`.
     *
     * It can be created manually, as follows:
     *
     * ### Example ([live demo](http://plnkr.co/edit/RfEnhh8kUEI0G3qsnIeT?p%3Dpreview&p=preview))
     *
     * ```typescript
     * var resolvedProviders = Injector.resolve([{ provide: 'message', useValue: 'Hello' }]);
     * var injector = Injector.fromResolvedProviders(resolvedProviders);
     *
     * expect(injector.get('message')).toEqual('Hello');
     * ```
     *
     * \@experimental
     * @record
     */
    var ResolvedReflectiveProvider_ = /*@__PURE__*/ (/*@__PURE__*/ function () {
        function ResolvedReflectiveProvider_(key, resolvedFactories, multiProvider) {
            this.key = key;
            this.resolvedFactories = resolvedFactories;
            this.multiProvider = multiProvider;
            this.resolvedFactory = this.resolvedFactories[0];
        }

        return ResolvedReflectiveProvider_;
    }());
    /**
     * An internal resolved representation of a factory function created by resolving {\@link
     * Provider}.
     * \@experimental
     */
    var ResolvedReflectiveFactory = /*@__PURE__*/ (/*@__PURE__*/ function () {
        function ResolvedReflectiveFactory(factory, dependencies) {
            this.factory = factory;
            this.dependencies = dependencies;
        }

        return ResolvedReflectiveFactory;
    }());

    /**
     * Resolve a single provider.
     * @param {?} provider
     * @return {?}
     */
    function resolveReflectiveFactory(provider) {
        var /** @type {?} */ factoryFn;
        var /** @type {?} */ resolvedDeps;
        if (provider.useClass) {
            var /** @type {?} */ useClass = resolveForwardRef(provider.useClass);
            factoryFn = reflector.factory(useClass);
            resolvedDeps = _dependenciesFor(useClass);
        }
        else if (provider.useExisting) {
            factoryFn = function (aliasInstance) {
                return aliasInstance;
            };
            resolvedDeps = [ReflectiveDependency.fromKey(ReflectiveKey.get(provider.useExisting))];
        }
        else if (provider.useFactory) {
            factoryFn = provider.useFactory;
            resolvedDeps = constructDependencies(provider.useFactory, provider.deps);
        }
        else {
            factoryFn = function () {
                return provider.useValue;
            };
            resolvedDeps = _EMPTY_LIST;
        }
        return new ResolvedReflectiveFactory(factoryFn, resolvedDeps);
    }

    /**
     * Converts the {\@link Provider} into {\@link ResolvedProvider}.
     *
     * {\@link Injector} internally only uses {\@link ResolvedProvider}, {\@link Provider} contains
     * convenience provider syntax.
     * @param {?} provider
     * @return {?}
     */
    function resolveReflectiveProvider(provider) {
        return new ResolvedReflectiveProvider_(ReflectiveKey.get(provider.provide), [resolveReflectiveFactory(provider)], provider.multi || false);
    }

    /**
     * Resolve a list of Providers.
     * @param {?} providers
     * @return {?}
     */
    function resolveReflectiveProviders(providers) {
        var /** @type {?} */ normalized = _normalizeProviders(providers, []);
        var /** @type {?} */ resolved = normalized.map(resolveReflectiveProvider);
        var /** @type {?} */ resolvedProviderMap = mergeResolvedReflectiveProviders(resolved, new Map());
        return Array.from(resolvedProviderMap.values());
    }

    /**
     * Merges a list of ResolvedProviders into a list where
     * each key is contained exactly once and multi providers
     * have been merged.
     * @param {?} providers
     * @param {?} normalizedProvidersMap
     * @return {?}
     */
    function mergeResolvedReflectiveProviders(providers, normalizedProvidersMap) {
        for (var /** @type {?} */ i = 0; i < providers.length; i++) {
            var /** @type {?} */ provider = providers[i];
            var /** @type {?} */ existing = normalizedProvidersMap.get(provider.key.id);
            if (existing) {
                if (provider.multiProvider !== existing.multiProvider) {
                    throw mixingMultiProvidersWithRegularProvidersError(existing, provider);
                }
                if (provider.multiProvider) {
                    for (var /** @type {?} */ j = 0; j < provider.resolvedFactories.length; j++) {
                        existing.resolvedFactories.push(provider.resolvedFactories[j]);
                    }
                }
                else {
                    normalizedProvidersMap.set(provider.key.id, provider);
                }
            }
            else {
                var /** @type {?} */ resolvedProvider = void 0;
                if (provider.multiProvider) {
                    resolvedProvider = new ResolvedReflectiveProvider_(provider.key, provider.resolvedFactories.slice(), provider.multiProvider);
                }
                else {
                    resolvedProvider = provider;
                }
                normalizedProvidersMap.set(provider.key.id, resolvedProvider);
            }
        }
        return normalizedProvidersMap;
    }

    /**
     * @param {?} providers
     * @param {?} res
     * @return {?}
     */
    function _normalizeProviders(providers, res) {
        providers.forEach(function (b) {
            if (b instanceof Type) {
                res.push({provide: b, useClass: b});
            }
            else if (b && typeof b == 'object' && ((b)).provide !== undefined) {
                res.push(/** @type {?} */ (b));
            }
            else if (b instanceof Array) {
                _normalizeProviders(b, res);
            }
            else {
                throw invalidProviderError(b);
            }
        });
        return res;
    }

    /**
     * @param {?} typeOrFunc
     * @param {?=} dependencies
     * @return {?}
     */
    function constructDependencies(typeOrFunc, dependencies) {
        if (!dependencies) {
            return _dependenciesFor(typeOrFunc);
        }
        else {
            var /** @type {?} */ params_1 = dependencies.map(function (t) {
                return [t];
            });
            return dependencies.map(function (t) {
                return _extractToken(typeOrFunc, t, params_1);
            });
        }
    }

    /**
     * @param {?} typeOrFunc
     * @return {?}
     */
    function _dependenciesFor(typeOrFunc) {
        var /** @type {?} */ params = reflector.parameters(typeOrFunc);
        if (!params)
            return [];
        if (params.some(function (p) {
            return p == null;
        })) {
            throw noAnnotationError(typeOrFunc, params);
        }
        return params.map(function (p) {
            return _extractToken(typeOrFunc, p, params);
        });
    }

    /**
     * @param {?} typeOrFunc
     * @param {?} metadata
     * @param {?} params
     * @return {?}
     */
    function _extractToken(typeOrFunc, metadata, params) {
        var /** @type {?} */ token = null;
        var /** @type {?} */ optional = false;
        if (!Array.isArray(metadata)) {
            if (metadata instanceof Inject) {
                return _createDependency(metadata.token, optional, null);
            }
            else {
                return _createDependency(metadata, optional, null);
            }
        }
        var /** @type {?} */ visibility = null;
        for (var /** @type {?} */ i = 0; i < metadata.length; ++i) {
            var /** @type {?} */ paramMetadata = metadata[i];
            if (paramMetadata instanceof Type) {
                token = paramMetadata;
            }
            else if (paramMetadata instanceof Inject) {
                token = paramMetadata.token;
            }
            else if (paramMetadata instanceof Optional) {
                optional = true;
            }
            else if (paramMetadata instanceof Self || paramMetadata instanceof SkipSelf) {
                visibility = paramMetadata;
            }
            else if (paramMetadata instanceof InjectionToken) {
                token = paramMetadata;
            }
        }
        token = resolveForwardRef(token);
        if (token != null) {
            return _createDependency(token, optional, visibility);
        }
        else {
            throw noAnnotationError(typeOrFunc, params);
        }
    }

    /**
     * @param {?} token
     * @param {?} optional
     * @param {?} visibility
     * @return {?}
     */
    function _createDependency(token, optional, visibility) {
        return new ReflectiveDependency(ReflectiveKey.get(token), optional, visibility);
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
// Threshold for the dynamic version
    var UNDEFINED = /*@__PURE__*/ new Object();
    /**
     * A ReflectiveDependency injection container used for instantiating objects and resolving
     * dependencies.
     *
     * An `Injector` is a replacement for a `new` operator, which can automatically resolve the
     * constructor dependencies.
     *
     * In typical use, application code asks for the dependencies in the constructor and they are
     * resolved by the `Injector`.
     *
     * ### Example ([live demo](http://plnkr.co/edit/jzjec0?p=preview))
     *
     * The following example creates an `Injector` configured to create `Engine` and `Car`.
     *
     * ```typescript
     * \@Injectable()
     * class Engine {
     * }
     *
     * \@Injectable()
     * class Car {
     *   constructor(public engine:Engine) {}
     * }
     *
     * var injector = ReflectiveInjector.resolveAndCreate([Car, Engine]);
     * var car = injector.get(Car);
     * expect(car instanceof Car).toBe(true);
     * expect(car.engine instanceof Engine).toBe(true);
     * ```
     *
     * Notice, we don't use the `new` operator because we explicitly want to have the `Injector`
     * resolve all of the object's dependencies automatically.
     *
     * @deprecated from v5 - slow and brings in a lot of code, Use `Injector.create` instead.
     * @abstract
     */
    var ReflectiveInjector = /*@__PURE__*/ (/*@__PURE__*/ function () {
        function ReflectiveInjector() {
        }

        /**
         * Turns an array of provider definitions into an array of resolved providers.
         *
         * A resolution is a process of flattening multiple nested arrays and converting individual
         * providers into an array of {@link ResolvedReflectiveProvider}s.
         *
         * ### Example ([live demo](http://plnkr.co/edit/AiXTHi?p=preview))
         *
         * ```typescript
         * @Injectable()
         * class Engine {
         * }
         *
         * @Injectable()
         * class Car {
         *   constructor(public engine:Engine) {}
         * }
         *
         * var providers = ReflectiveInjector.resolve([Car, [[Engine]]]);
         *
         * expect(providers.length).toEqual(2);
         *
         * expect(providers[0] instanceof ResolvedReflectiveProvider).toBe(true);
         * expect(providers[0].key.displayName).toBe("Car");
         * expect(providers[0].dependencies.length).toEqual(1);
         * expect(providers[0].factory).toBeDefined();
         *
         * expect(providers[1].key.displayName).toBe("Engine");
         * });
         * ```
         *
         * See {@link ReflectiveInjector#fromResolvedProviders fromResolvedProviders} for more info.
         */
        /**
         * Turns an array of provider definitions into an array of resolved providers.
         *
         * A resolution is a process of flattening multiple nested arrays and converting individual
         * providers into an array of {\@link ResolvedReflectiveProvider}s.
         *
         * ### Example ([live demo](http://plnkr.co/edit/AiXTHi?p=preview))
         *
         * ```typescript
         * \@Injectable()
         * class Engine {
         * }
         *
         * \@Injectable()
         * class Car {
         *   constructor(public engine:Engine) {}
         * }
         *
         * var providers = ReflectiveInjector.resolve([Car, [[Engine]]]);
         *
         * expect(providers.length).toEqual(2);
         *
         * expect(providers[0] instanceof ResolvedReflectiveProvider).toBe(true);
         * expect(providers[0].key.displayName).toBe("Car");
         * expect(providers[0].dependencies.length).toEqual(1);
         * expect(providers[0].factory).toBeDefined();
         *
         * expect(providers[1].key.displayName).toBe("Engine");
         * });
         * ```
         *
         * See {\@link ReflectiveInjector#fromResolvedProviders fromResolvedProviders} for more info.
         * @param {?} providers
         * @return {?}
         */
        ReflectiveInjector.resolve = /**
         * Turns an array of provider definitions into an array of resolved providers.
         *
         * A resolution is a process of flattening multiple nested arrays and converting individual
         * providers into an array of {\@link ResolvedReflectiveProvider}s.
         *
         * ### Example ([live demo](http://plnkr.co/edit/AiXTHi?p=preview))
         *
         * ```typescript
         * \@Injectable()
         * class Engine {
         * }
         *
         * \@Injectable()
         * class Car {
         *   constructor(public engine:Engine) {}
         * }
         *
         * var providers = ReflectiveInjector.resolve([Car, [[Engine]]]);
         *
         * expect(providers.length).toEqual(2);
         *
         * expect(providers[0] instanceof ResolvedReflectiveProvider).toBe(true);
         * expect(providers[0].key.displayName).toBe("Car");
         * expect(providers[0].dependencies.length).toEqual(1);
         * expect(providers[0].factory).toBeDefined();
         *
         * expect(providers[1].key.displayName).toBe("Engine");
         * });
         * ```
         *
         * See {\@link ReflectiveInjector#fromResolvedProviders fromResolvedProviders} for more info.
         * @param {?} providers
         * @return {?}
         */
        function (providers) {
            return resolveReflectiveProviders(providers);
        };
        /**
         * Resolves an array of providers and creates an injector from those providers.
         *
         * The passed-in providers can be an array of `Type`, {@link Provider},
         * or a recursive array of more providers.
         *
         * ### Example ([live demo](http://plnkr.co/edit/ePOccA?p=preview))
         *
         * ```typescript
         * @Injectable()
         * class Engine {
         * }
         *
         * @Injectable()
         * class Car {
         *   constructor(public engine:Engine) {}
         * }
         *
         * var injector = ReflectiveInjector.resolveAndCreate([Car, Engine]);
         * expect(injector.get(Car) instanceof Car).toBe(true);
         * ```
         *
         * This function is slower than the corresponding `fromResolvedProviders`
         * because it needs to resolve the passed-in providers first.
         * See {@link ReflectiveInjector#resolve resolve} and
         * {@link ReflectiveInjector#fromResolvedProviders fromResolvedProviders}.
         */
        /**
         * Resolves an array of providers and creates an injector from those providers.
         *
         * The passed-in providers can be an array of `Type`, {\@link Provider},
         * or a recursive array of more providers.
         *
         * ### Example ([live demo](http://plnkr.co/edit/ePOccA?p=preview))
         *
         * ```typescript
         * \@Injectable()
         * class Engine {
         * }
         *
         * \@Injectable()
         * class Car {
         *   constructor(public engine:Engine) {}
         * }
         *
         * var injector = ReflectiveInjector.resolveAndCreate([Car, Engine]);
         * expect(injector.get(Car) instanceof Car).toBe(true);
         * ```
         *
         * This function is slower than the corresponding `fromResolvedProviders`
         * because it needs to resolve the passed-in providers first.
         * See {\@link ReflectiveInjector#resolve resolve} and
         * {\@link ReflectiveInjector#fromResolvedProviders fromResolvedProviders}.
         * @param {?} providers
         * @param {?=} parent
         * @return {?}
         */
        ReflectiveInjector.resolveAndCreate = /**
         * Resolves an array of providers and creates an injector from those providers.
         *
         * The passed-in providers can be an array of `Type`, {\@link Provider},
         * or a recursive array of more providers.
         *
         * ### Example ([live demo](http://plnkr.co/edit/ePOccA?p=preview))
         *
         * ```typescript
         * \@Injectable()
         * class Engine {
         * }
         *
         * \@Injectable()
         * class Car {
         *   constructor(public engine:Engine) {}
         * }
         *
         * var injector = ReflectiveInjector.resolveAndCreate([Car, Engine]);
         * expect(injector.get(Car) instanceof Car).toBe(true);
         * ```
         *
         * This function is slower than the corresponding `fromResolvedProviders`
         * because it needs to resolve the passed-in providers first.
         * See {\@link ReflectiveInjector#resolve resolve} and
         * {\@link ReflectiveInjector#fromResolvedProviders fromResolvedProviders}.
         * @param {?} providers
         * @param {?=} parent
         * @return {?}
         */
        function (providers, parent) {
            var /** @type {?} */ ResolvedReflectiveProviders = ReflectiveInjector.resolve(providers);
            return ReflectiveInjector.fromResolvedProviders(ResolvedReflectiveProviders, parent);
        };
        /**
         * Creates an injector from previously resolved providers.
         *
         * This API is the recommended way to construct injectors in performance-sensitive parts.
         *
         * ### Example ([live demo](http://plnkr.co/edit/KrSMci?p=preview))
         *
         * ```typescript
         * @Injectable()
         * class Engine {
         * }
         *
         * @Injectable()
         * class Car {
         *   constructor(public engine:Engine) {}
         * }
         *
         * var providers = ReflectiveInjector.resolve([Car, Engine]);
         * var injector = ReflectiveInjector.fromResolvedProviders(providers);
         * expect(injector.get(Car) instanceof Car).toBe(true);
         * ```
         * @experimental
         */
        /**
         * Creates an injector from previously resolved providers.
         *
         * This API is the recommended way to construct injectors in performance-sensitive parts.
         *
         * ### Example ([live demo](http://plnkr.co/edit/KrSMci?p=preview))
         *
         * ```typescript
         * \@Injectable()
         * class Engine {
         * }
         *
         * \@Injectable()
         * class Car {
         *   constructor(public engine:Engine) {}
         * }
         *
         * var providers = ReflectiveInjector.resolve([Car, Engine]);
         * var injector = ReflectiveInjector.fromResolvedProviders(providers);
         * expect(injector.get(Car) instanceof Car).toBe(true);
         * ```
         * \@experimental
         * @param {?} providers
         * @param {?=} parent
         * @return {?}
         */
        ReflectiveInjector.fromResolvedProviders = /**
         * Creates an injector from previously resolved providers.
         *
         * This API is the recommended way to construct injectors in performance-sensitive parts.
         *
         * ### Example ([live demo](http://plnkr.co/edit/KrSMci?p=preview))
         *
         * ```typescript
         * \@Injectable()
         * class Engine {
         * }
         *
         * \@Injectable()
         * class Car {
         *   constructor(public engine:Engine) {}
         * }
         *
         * var providers = ReflectiveInjector.resolve([Car, Engine]);
         * var injector = ReflectiveInjector.fromResolvedProviders(providers);
         * expect(injector.get(Car) instanceof Car).toBe(true);
         * ```
         * \@experimental
         * @param {?} providers
         * @param {?=} parent
         * @return {?}
         */
        function (providers, parent) {
            return new ReflectiveInjector_(providers, parent);
        };
        return ReflectiveInjector;
    }());
    var ReflectiveInjector_ = /*@__PURE__*/ (/*@__PURE__*/ function () {
        /**
         * Private
         */
        function ReflectiveInjector_(_providers, _parent) {
            /**
             * \@internal
             */
            this._constructionCounter = 0;
            this._providers = _providers;
            this.parent = _parent || null;
            var /** @type {?} */ len = _providers.length;
            this.keyIds = new Array(len);
            this.objs = new Array(len);
            for (var /** @type {?} */ i = 0; i < len; i++) {
                this.keyIds[i] = _providers[i].key.id;
                this.objs[i] = UNDEFINED;
            }
        }

        /**
         * @param {?} token
         * @param {?=} notFoundValue
         * @return {?}
         */
        ReflectiveInjector_.prototype.get = /**
         * @param {?} token
         * @param {?=} notFoundValue
         * @return {?}
         */
        function (token, notFoundValue) {
            if (notFoundValue === void 0) {
                notFoundValue = THROW_IF_NOT_FOUND;
            }
            return this._getByKey(ReflectiveKey.get(token), null, notFoundValue);
        };
        /**
         * @param {?} providers
         * @return {?}
         */
        ReflectiveInjector_.prototype.resolveAndCreateChild = /**
         * @param {?} providers
         * @return {?}
         */
        function (providers) {
            var /** @type {?} */ ResolvedReflectiveProviders = ReflectiveInjector.resolve(providers);
            return this.createChildFromResolved(ResolvedReflectiveProviders);
        };
        /**
         * @param {?} providers
         * @return {?}
         */
        ReflectiveInjector_.prototype.createChildFromResolved = /**
         * @param {?} providers
         * @return {?}
         */
        function (providers) {
            var /** @type {?} */ inj = new ReflectiveInjector_(providers);
            ((inj)).parent = this;
            return inj;
        };
        /**
         * @param {?} provider
         * @return {?}
         */
        ReflectiveInjector_.prototype.resolveAndInstantiate = /**
         * @param {?} provider
         * @return {?}
         */
        function (provider) {
            return this.instantiateResolved(ReflectiveInjector.resolve([provider])[0]);
        };
        /**
         * @param {?} provider
         * @return {?}
         */
        ReflectiveInjector_.prototype.instantiateResolved = /**
         * @param {?} provider
         * @return {?}
         */
        function (provider) {
            return this._instantiateProvider(provider);
        };
        /**
         * @param {?} index
         * @return {?}
         */
        ReflectiveInjector_.prototype.getProviderAtIndex = /**
         * @param {?} index
         * @return {?}
         */
        function (index) {
            if (index < 0 || index >= this._providers.length) {
                throw outOfBoundsError(index);
            }
            return this._providers[index];
        };
        /** @internal */
        /**
         * \@internal
         * @param {?} provider
         * @return {?}
         */
        ReflectiveInjector_.prototype._new = /**
         * \@internal
         * @param {?} provider
         * @return {?}
         */
        function (provider) {
            if (this._constructionCounter++ > this._getMaxNumberOfObjects()) {
                throw cyclicDependencyError(this, provider.key);
            }
            return this._instantiateProvider(provider);
        };
        /**
         * @return {?}
         */
        ReflectiveInjector_.prototype._getMaxNumberOfObjects = /**
         * @return {?}
         */
        function () {
            return this.objs.length;
        };
        /**
         * @param {?} provider
         * @return {?}
         */
        ReflectiveInjector_.prototype._instantiateProvider = /**
         * @param {?} provider
         * @return {?}
         */
        function (provider) {
            if (provider.multiProvider) {
                var /** @type {?} */ res = new Array(provider.resolvedFactories.length);
                for (var /** @type {?} */ i = 0; i < provider.resolvedFactories.length; ++i) {
                    res[i] = this._instantiate(provider, provider.resolvedFactories[i]);
                }
                return res;
            }
            else {
                return this._instantiate(provider, provider.resolvedFactories[0]);
            }
        };
        /**
         * @param {?} provider
         * @param {?} ResolvedReflectiveFactory
         * @return {?}
         */
        ReflectiveInjector_.prototype._instantiate = /**
         * @param {?} provider
         * @param {?} ResolvedReflectiveFactory
         * @return {?}
         */
        function (provider, ResolvedReflectiveFactory$$1) {
            var _this = this;
            var /** @type {?} */ factory = ResolvedReflectiveFactory$$1.factory;
            var /** @type {?} */ deps;
            try {
                deps =
                    ResolvedReflectiveFactory$$1.dependencies.map(function (dep) {
                        return _this._getByReflectiveDependency(dep);
                    });
            }
            catch (e) {
                if (e.addKey) {
                    e.addKey(this, provider.key);
                }
                throw e;
            }
            var /** @type {?} */ obj;
            try {
                obj = factory.apply(void 0, deps);
            }
            catch (e) {
                throw instantiationError(this, e, e.stack, provider.key);
            }
            return obj;
        };
        /**
         * @param {?} dep
         * @return {?}
         */
        ReflectiveInjector_.prototype._getByReflectiveDependency = /**
         * @param {?} dep
         * @return {?}
         */
        function (dep) {
            return this._getByKey(dep.key, dep.visibility, dep.optional ? null : THROW_IF_NOT_FOUND);
        };
        /**
         * @param {?} key
         * @param {?} visibility
         * @param {?} notFoundValue
         * @return {?}
         */
        ReflectiveInjector_.prototype._getByKey = /**
         * @param {?} key
         * @param {?} visibility
         * @param {?} notFoundValue
         * @return {?}
         */
        function (key, visibility, notFoundValue) {
            if (key === ReflectiveInjector_.INJECTOR_KEY) {
                return this;
            }
            if (visibility instanceof Self) {
                return this._getByKeySelf(key, notFoundValue);
            }
            else {
                return this._getByKeyDefault(key, notFoundValue, visibility);
            }
        };
        /**
         * @param {?} keyId
         * @return {?}
         */
        ReflectiveInjector_.prototype._getObjByKeyId = /**
         * @param {?} keyId
         * @return {?}
         */
        function (keyId) {
            for (var /** @type {?} */ i = 0; i < this.keyIds.length; i++) {
                if (this.keyIds[i] === keyId) {
                    if (this.objs[i] === UNDEFINED) {
                        this.objs[i] = this._new(this._providers[i]);
                    }
                    return this.objs[i];
                }
            }
            return UNDEFINED;
        };
        /** @internal */
        /**
         * \@internal
         * @param {?} key
         * @param {?} notFoundValue
         * @return {?}
         */
        ReflectiveInjector_.prototype._throwOrNull = /**
         * \@internal
         * @param {?} key
         * @param {?} notFoundValue
         * @return {?}
         */
        function (key, notFoundValue) {
            if (notFoundValue !== THROW_IF_NOT_FOUND) {
                return notFoundValue;
            }
            else {
                throw noProviderError(this, key);
            }
        };
        /** @internal */
        /**
         * \@internal
         * @param {?} key
         * @param {?} notFoundValue
         * @return {?}
         */
        ReflectiveInjector_.prototype._getByKeySelf = /**
         * \@internal
         * @param {?} key
         * @param {?} notFoundValue
         * @return {?}
         */
        function (key, notFoundValue) {
            var /** @type {?} */ obj = this._getObjByKeyId(key.id);
            return (obj !== UNDEFINED) ? obj : this._throwOrNull(key, notFoundValue);
        };
        /** @internal */
        /**
         * \@internal
         * @param {?} key
         * @param {?} notFoundValue
         * @param {?} visibility
         * @return {?}
         */
        ReflectiveInjector_.prototype._getByKeyDefault = /**
         * \@internal
         * @param {?} key
         * @param {?} notFoundValue
         * @param {?} visibility
         * @return {?}
         */
        function (key, notFoundValue, visibility) {
            var /** @type {?} */ inj;
            if (visibility instanceof SkipSelf) {
                inj = this.parent;
            }
            else {
                inj = this;
            }
            while (inj instanceof ReflectiveInjector_) {
                var /** @type {?} */ inj_ = (inj);
                var /** @type {?} */ obj = inj_._getObjByKeyId(key.id);
                if (obj !== UNDEFINED)
                    return obj;
                inj = inj_.parent;
            }
            if (inj !== null) {
                return inj.get(key.token, notFoundValue);
            }
            else {
                return this._throwOrNull(key, notFoundValue);
            }
        };
        Object.defineProperty(ReflectiveInjector_.prototype, "displayName", {
            get: /**
             * @return {?}
             */ function () {
                var /** @type {?} */ providers = _mapProviders(this, function (b) {
                    return ' "' + b.key.displayName + '" ';
                })
                    .join(', ');
                return "ReflectiveInjector(providers: [" + providers + "])";
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @return {?}
         */
        ReflectiveInjector_.prototype.toString = /**
         * @return {?}
         */
        function () {
            return this.displayName;
        };
        ReflectiveInjector_.INJECTOR_KEY = ReflectiveKey.get(Injector);
        return ReflectiveInjector_;
    }());

    /**
     * @param {?} injector
     * @param {?} fn
     * @return {?}
     */
    function _mapProviders(injector, fn) {
        var /** @type {?} */ res = new Array(injector._providers.length);
        for (var /** @type {?} */ i = 0; i < injector._providers.length; ++i) {
            res[i] = fn(injector.getProviderAtIndex(i));
        }
        return res;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * @module
     * @description
     * The `di` module provides dependency injection container services.
     */
    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */

    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * Determine if the argument is shaped like a Promise
     * @param {?} obj
     * @return {?}
     */
    function isPromise$1(obj) {
        // allow any Promise/A+ compliant thenable.
        // It's up to the caller to ensure that obj.then conforms to the spec
        return !!obj && typeof obj.then === 'function';
    }

    /**
     * A class that reflects the state of running {\@link APP_INITIALIZER}s.
     *
     * \@experimental
     */
    var ApplicationInitStatus = /*@__PURE__*/ (/*@__PURE__*/ function () {
        function ApplicationInitStatus(appInits) {
            var _this = this;
            this.appInits = appInits;
            this.initialized = false;
            this.done = false;
            this.donePromise = new Promise(function (res, rej) {
                _this.resolve = res;
                _this.reject = rej;
            });
        }

        /** @internal */
        /**
         * \@internal
         * @return {?}
         */
        ApplicationInitStatus.prototype.runInitializers = /**
         * \@internal
         * @return {?}
         */
        function () {
            var _this = this;
            if (this.initialized) {
                return;
            }
            var /** @type {?} */ asyncInitPromises = [];
            var /** @type {?} */ complete = function () {
                ((_this)).done = true;
                _this.resolve();
            };
            if (this.appInits) {
                for (var /** @type {?} */ i = 0; i < this.appInits.length; i++) {
                    var /** @type {?} */ initResult = this.appInits[i]();
                    if (isPromise$1(initResult)) {
                        asyncInitPromises.push(initResult);
                    }
                }
            }
            Promise.all(asyncInitPromises).then(function () {
                complete();
            }).catch(function (e) {
                _this.reject(e);
            });
            if (asyncInitPromises.length === 0) {
                complete();
            }
            this.initialized = true;
        };
        return ApplicationInitStatus;
    }());
    /**
     * All callbacks provided via this token will be called for every component that is bootstrapped.
     * Signature of the callback:
     *
     * `(componentRef: ComponentRef) => void`.
     *
     * \@experimental
     */
    var APP_BOOTSTRAP_LISTENER = /*@__PURE__*/ new InjectionToken('appBootstrapListener');
    /**
     * A factory for creating a Compiler
     *
     * \@experimental
     * @abstract
     */
    var CompilerFactory = /*@__PURE__*/ (/*@__PURE__*/ function () {
        function CompilerFactory() {
        }

        return CompilerFactory;
    }());
    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * Represents an instance of a Component created via a {\@link ComponentFactory}.
     *
     * `ComponentRef` provides access to the Component Instance as well other objects related to this
     * Component Instance and allows you to destroy the Component Instance via the {\@link #destroy}
     * method.
     * \@stable
     * @abstract
     */
    var ComponentRef = /*@__PURE__*/ (/*@__PURE__*/ function () {
        function ComponentRef() {
        }

        return ComponentRef;
    }());
    /**
     * \@stable
     * @abstract
     */
    var ComponentFactory = /*@__PURE__*/ (/*@__PURE__*/ function () {
        function ComponentFactory() {
        }

        return ComponentFactory;
    }());
    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */

    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * @param {?} component
     * @return {?}
     */
    function noComponentFactoryError(component) {
        var /** @type {?} */ error = Error("No component factory found for " + stringify(component) + ". Did you add it to @NgModule.entryComponents?");
        ((error))[ERROR_COMPONENT] = component;
        return error;
    }

    var ERROR_COMPONENT = 'ngComponent';
    /**
     * @param {?} error
     * @return {?}
     */
    var _NullComponentFactoryResolver = /*@__PURE__*/ (/*@__PURE__*/ function () {
        function _NullComponentFactoryResolver() {
        }

        /**
         * @template T
         * @param {?} component
         * @return {?}
         */
        _NullComponentFactoryResolver.prototype.resolveComponentFactory = /**
         * @template T
         * @param {?} component
         * @return {?}
         */
        function (component) {
            throw noComponentFactoryError(component);
        };
        return _NullComponentFactoryResolver;
    }());
    /**
     * \@stable
     * @abstract
     */
    var ComponentFactoryResolver = /*@__PURE__*/ (/*@__PURE__*/ function () {
        function ComponentFactoryResolver() {
        }

        ComponentFactoryResolver.NULL = new _NullComponentFactoryResolver();
        return ComponentFactoryResolver;
    }());
    var ComponentFactoryBoundToModule = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
        __extends(ComponentFactoryBoundToModule, _super);

        function ComponentFactoryBoundToModule(factory, ngModule) {
            var _this = _super.call(this) || this;
            _this.factory = factory;
            _this.ngModule = ngModule;
            _this.selector = factory.selector;
            _this.componentType = factory.componentType;
            _this.ngContentSelectors = factory.ngContentSelectors;
            _this.inputs = factory.inputs;
            _this.outputs = factory.outputs;
            return _this;
        }

        /**
         * @param {?} injector
         * @param {?=} projectableNodes
         * @param {?=} rootSelectorOrNode
         * @param {?=} ngModule
         * @return {?}
         */
        ComponentFactoryBoundToModule.prototype.create = /**
         * @param {?} injector
         * @param {?=} projectableNodes
         * @param {?=} rootSelectorOrNode
         * @param {?=} ngModule
         * @return {?}
         */
        function (injector, projectableNodes, rootSelectorOrNode, ngModule) {
            return this.factory.create(injector, projectableNodes, rootSelectorOrNode, ngModule || this.ngModule);
        };
        return ComponentFactoryBoundToModule;
    }(ComponentFactory));
    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * Represents an instance of an NgModule created via a {\@link NgModuleFactory}.
     *
     * `NgModuleRef` provides access to the NgModule Instance as well other objects related to this
     * NgModule Instance.
     *
     * \@stable
     * @abstract
     */
    var NgModuleRef = /*@__PURE__*/ (/*@__PURE__*/ function () {
        function NgModuleRef() {
        }

        return NgModuleRef;
    }());
    /**
     * @record
     */
    /**
     * \@experimental
     * @abstract
     */
    var NgModuleFactory = /*@__PURE__*/ (/*@__PURE__*/ function () {
        function NgModuleFactory() {
        }

        return NgModuleFactory;
    }());
    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * A scope function for the Web Tracing Framework (WTF).
     *
     * \@experimental
     * @record
     */
    /**
     * @record
     */
    /**
     * @record
     */
    var trace;
    var events;

    /**
     * @return {?}
     */
    function detectWTF() {
        var /** @type {?} */ wtf = ((_global /** TODO #9100 */) /** TODO #9100 */)['wtf'];
        if (wtf) {
            trace = wtf['trace'];
            if (trace) {
                events = trace['events'];
                return true;
            }
        }
        return false;
    }

    /**
     * @param {?} signature
     * @param {?=} flags
     * @return {?}
     */
    function createScope(signature, flags) {
        if (flags === void 0) {
            flags = null;
        }
        return events.createScope(signature, flags);
    }

    /**
     * @template T
     * @param {?} scope
     * @param {?=} returnValue
     * @return {?}
     */
    function leave(scope, returnValue) {
        trace.leaveScope(scope, returnValue);
        return returnValue;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * True if WTF is enabled.
     */
    var wtfEnabled = /*@__PURE__*/ detectWTF();

    /**
     * @param {?=} arg0
     * @param {?=} arg1
     * @return {?}
     */
    function noopScope(arg0, arg1) {
        return null;
    }

    /**
     * Create trace scope.
     *
     * Scopes must be strictly nested and are analogous to stack frames, but
     * do not have to follow the stack frames. Instead it is recommended that they follow logical
     * nesting. You may want to use
     * [Event
     * Signatures](http://google.github.io/tracing-framework/instrumenting-code.html#custom-events)
     * as they are defined in WTF.
     *
     * Used to mark scope entry. The return value is used to leave the scope.
     *
     *     var myScope = wtfCreateScope('MyClass#myMethod(ascii someVal)');
     *
     *     someMethod() {
     *        var s = myScope('Foo'); // 'Foo' gets stored in tracing UI
     *        // DO SOME WORK HERE
     *        return wtfLeave(s, 123); // Return value 123
     *     }
     *
     * Note, adding try-finally block around the work to ensure that `wtfLeave` gets called can
     * negatively impact the performance of your application. For this reason we recommend that
     * you don't add them to ensure that `wtfLeave` gets called. In production `wtfLeave` is a noop and
     * so try-finally block has no value. When debugging perf issues, skipping `wtfLeave`, do to
     * exception, will produce incorrect trace, but presence of exception signifies logic error which
     * needs to be fixed before the app should be profiled. Add try-finally only when you expect that
     * an exception is expected during normal execution while profiling.
     *
     * \@experimental
     */
    var wtfCreateScope = wtfEnabled ? createScope : function (signature, flags) {
        return noopScope;
    };
    /**
     * Used to mark end of Scope.
     *
     * - `scope` to end.
     * - `returnValue` (optional) to be passed to the WTF.
     *
     * Returns the `returnValue for easy chaining.
     * \@experimental
     */
    var wtfLeave = wtfEnabled ? leave : function (s, r) {
        return r;
    };
    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * Use by directives and components to emit custom Events.
     *
     * ### Examples
     *
     * In the following example, `Zippy` alternatively emits `open` and `close` events when its
     * title gets clicked:
     *
     * ```
     * \@Component({
     *   selector: 'zippy',
     *   template: `
     *   <div class="zippy">
     *     <div (click)="toggle()">Toggle</div>
     *     <div [hidden]="!visible">
     *       <ng-content></ng-content>
     *     </div>
     *  </div>`})
     * export class Zippy {
     *   visible: boolean = true;
     *   \@Output() open: EventEmitter<any> = new EventEmitter();
     *   \@Output() close: EventEmitter<any> = new EventEmitter();
     *
     *   toggle() {
     *     this.visible = !this.visible;
     *     if (this.visible) {
     *       this.open.emit(null);
     *     } else {
     *       this.close.emit(null);
     *     }
     *   }
     * }
     * ```
     *
     * The events payload can be accessed by the parameter `$event` on the components output event
     * handler:
     *
     * ```
     * <zippy (open)="onOpen($event)" (close)="onClose($event)"></zippy>
     * ```
     *
     * Uses Rx.Observable but provides an adapter to make it work as specified here:
     * https://github.com/jhusain/observable-spec
     *
     * Once a reference implementation of the spec is available, switch to it.
     * \@stable
     */
    var EventEmitter = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
        __extends(EventEmitter, _super);

        /**
         * Creates an instance of {@link EventEmitter}, which depending on `isAsync`,
         * delivers events synchronously or asynchronously.
         *
         * @param isAsync By default, events are delivered synchronously (default value: `false`).
         * Set to `true` for asynchronous event delivery.
         */
        function EventEmitter(isAsync) {
            if (isAsync === void 0) {
                isAsync = false;
            }
            var _this = _super.call(this) || this;
            _this.__isAsync = isAsync;
            return _this;
        }

        /**
         * @param {?=} value
         * @return {?}
         */
        EventEmitter.prototype.emit = /**
         * @param {?=} value
         * @return {?}
         */
        function (value) {
            _super.prototype.next.call(this, value);
        };
        /**
         * @param {?=} generatorOrNext
         * @param {?=} error
         * @param {?=} complete
         * @return {?}
         */
        EventEmitter.prototype.subscribe = /**
         * @param {?=} generatorOrNext
         * @param {?=} error
         * @param {?=} complete
         * @return {?}
         */
        function (generatorOrNext, error, complete) {
            var /** @type {?} */ schedulerFn;
            var /** @type {?} */ errorFn = function (err) {
                return null;
            };
            var /** @type {?} */ completeFn = function () {
                return null;
            };
            if (generatorOrNext && typeof generatorOrNext === 'object') {
                schedulerFn = this.__isAsync ? function (value) {
                    setTimeout(function () {
                        return generatorOrNext.next(value);
                    });
                } : function (value) {
                    generatorOrNext.next(value);
                };
                if (generatorOrNext.error) {
                    errorFn = this.__isAsync ? function (err) {
                            setTimeout(function () {
                                return generatorOrNext.error(err);
                            });
                        } :
                        function (err) {
                            generatorOrNext.error(err);
                        };
                }
                if (generatorOrNext.complete) {
                    completeFn = this.__isAsync ? function () {
                            setTimeout(function () {
                                return generatorOrNext.complete();
                            });
                        } :
                        function () {
                            generatorOrNext.complete();
                        };
                }
            }
            else {
                schedulerFn = this.__isAsync ? function (value) {
                        setTimeout(function () {
                            return generatorOrNext(value);
                        });
                    } :
                    function (value) {
                        generatorOrNext(value);
                    };
                if (error) {
                    errorFn =
                        this.__isAsync ? function (err) {
                            setTimeout(function () {
                                return error(err);
                            });
                        } : function (err) {
                            error(err);
                        };
                }
                if (complete) {
                    completeFn =
                        this.__isAsync ? function () {
                            setTimeout(function () {
                                return complete();
                            });
                        } : function () {
                            complete();
                        };
                }
            }
            var /** @type {?} */ sink = _super.prototype.subscribe.call(this, schedulerFn, errorFn, completeFn);
            if (generatorOrNext instanceof Subscription) {
                generatorOrNext.add(sink);
            }
            return sink;
        };
        return EventEmitter;
    }(Subject));
    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * An injectable service for executing work inside or outside of the Angular zone.
     *
     * The most common use of this service is to optimize performance when starting a work consisting of
     * one or more asynchronous tasks that don't require UI updates or error handling to be handled by
     * Angular. Such tasks can be kicked off via {\@link #runOutsideAngular} and if needed, these tasks
     * can reenter the Angular zone via {\@link #run}.
     *
     * <!-- TODO: add/fix links to:
     *   - docs explaining zones and the use of zones in Angular and change-detection
     *   - link to runOutsideAngular/run (throughout this file!)
     *   -->
     *
     * ### Example
     *
     * ```
     * import {Component, NgZone} from '\@angular/core';
     * import {NgIf} from '\@angular/common';
     *
     * \@Component({
     *   selector: 'ng-zone-demo',
     *   template: `
     *     <h2>Demo: NgZone</h2>
     *
     *     <p>Progress: {{progress}}%</p>
     *     <p *ngIf="progress >= 100">Done processing {{label}} of Angular zone!</p>
     *
     *     <button (click)="processWithinAngularZone()">Process within Angular zone</button>
     *     <button (click)="processOutsideOfAngularZone()">Process outside of Angular zone</button>
     *   `,
     * })
     * export class NgZoneDemo {
     *   progress: number = 0;
     *   label: string;
     *
     *   constructor(private _ngZone: NgZone) {}
     *
     *   // Loop inside the Angular zone
     *   // so the UI DOES refresh after each setTimeout cycle
     *   processWithinAngularZone() {
     *     this.label = 'inside';
     *     this.progress = 0;
     *     this._increaseProgress(() => console.log('Inside Done!'));
     *   }
     *
     *   // Loop outside of the Angular zone
     *   // so the UI DOES NOT refresh after each setTimeout cycle
     *   processOutsideOfAngularZone() {
     *     this.label = 'outside';
     *     this.progress = 0;
     *     this._ngZone.runOutsideAngular(() => {
     *       this._increaseProgress(() => {
     *         // reenter the Angular zone and display done
     *         this._ngZone.run(() => { console.log('Outside Done!'); });
     *       });
     *     });
     *   }
     *
     *   _increaseProgress(doneCallback: () => void) {
     *     this.progress += 1;
     *     console.log(`Current progress: ${this.progress}%`);
     *
     *     if (this.progress < 100) {
     *       window.setTimeout(() => this._increaseProgress(doneCallback), 10);
     *     } else {
     *       doneCallback();
     *     }
     *   }
     * }
     * ```
     *
     * \@experimental
     */
    var NgZone = /*@__PURE__*/ (/*@__PURE__*/ function () {
        function NgZone(_a) {
            var _b = _a.enableLongStackTrace, enableLongStackTrace = _b === void 0 ? false : _b;
            this.hasPendingMicrotasks = false;
            this.hasPendingMacrotasks = false;
            /**
             * Whether there are no outstanding microtasks or macrotasks.
             */
            this.isStable = true;
            /**
             * Notifies when code enters Angular Zone. This gets fired first on VM Turn.
             */
            this.onUnstable = new EventEmitter(false);
            /**
             * Notifies when there is no more microtasks enqueued in the current VM Turn.
             * This is a hint for Angular to do change detection, which may enqueue more microtasks.
             * For this reason this event can fire multiple times per VM Turn.
             */
            this.onMicrotaskEmpty = new EventEmitter(false);
            /**
             * Notifies when the last `onMicrotaskEmpty` has run and there are no more microtasks, which
             * implies we are about to relinquish VM turn.
             * This event gets called just once.
             */
            this.onStable = new EventEmitter(false);
            /**
             * Notifies that an error has been delivered.
             */
            this.onError = new EventEmitter(false);
            if (typeof Zone == 'undefined') {
                throw new Error("In this configuration Angular requires Zone.js");
            }
            Zone.assertZonePatched();
            var /** @type {?} */ self = ((this));
            self._nesting = 0;
            self._outer = self._inner = Zone.current;
            if (((Zone))['wtfZoneSpec']) {
                self._inner = self._inner.fork(((Zone))['wtfZoneSpec']);
            }
            if (enableLongStackTrace && ((Zone))['longStackTraceZoneSpec']) {
                self._inner = self._inner.fork(((Zone))['longStackTraceZoneSpec']);
            }
            forkInnerZoneWithAngularBehavior(self);
        }

        /**
         * @return {?}
         */
        NgZone.isInAngularZone = /**
         * @return {?}
         */
        function () {
            return Zone.current.get('isAngularZone') === true;
        };
        /**
         * @return {?}
         */
        NgZone.assertInAngularZone = /**
         * @return {?}
         */
        function () {
            if (!NgZone.isInAngularZone()) {
                throw new Error('Expected to be in Angular Zone, but it is not!');
            }
        };
        /**
         * @return {?}
         */
        NgZone.assertNotInAngularZone = /**
         * @return {?}
         */
        function () {
            if (NgZone.isInAngularZone()) {
                throw new Error('Expected to not be in Angular Zone, but it is!');
            }
        };
        /**
         * Executes the `fn` function synchronously within the Angular zone and returns value returned by
         * the function.
         *
         * Running functions via `run` allows you to reenter Angular zone from a task that was executed
         * outside of the Angular zone (typically started via {@link #runOutsideAngular}).
         *
         * Any future tasks or microtasks scheduled from within this function will continue executing from
         * within the Angular zone.
         *
         * If a synchronous error happens it will be rethrown and not reported via `onError`.
         */
        /**
         * Executes the `fn` function synchronously within the Angular zone and returns value returned by
         * the function.
         *
         * Running functions via `run` allows you to reenter Angular zone from a task that was executed
         * outside of the Angular zone (typically started via {\@link #runOutsideAngular}).
         *
         * Any future tasks or microtasks scheduled from within this function will continue executing from
         * within the Angular zone.
         *
         * If a synchronous error happens it will be rethrown and not reported via `onError`.
         * @template T
         * @param {?} fn
         * @param {?=} applyThis
         * @param {?=} applyArgs
         * @return {?}
         */
        NgZone.prototype.run = /**
         * Executes the `fn` function synchronously within the Angular zone and returns value returned by
         * the function.
         *
         * Running functions via `run` allows you to reenter Angular zone from a task that was executed
         * outside of the Angular zone (typically started via {\@link #runOutsideAngular}).
         *
         * Any future tasks or microtasks scheduled from within this function will continue executing from
         * within the Angular zone.
         *
         * If a synchronous error happens it will be rethrown and not reported via `onError`.
         * @template T
         * @param {?} fn
         * @param {?=} applyThis
         * @param {?=} applyArgs
         * @return {?}
         */
        function (fn, applyThis, applyArgs) {
            return /** @type {?} */ ((((this)))._inner.run(fn, applyThis, applyArgs));
        };
        /**
         * Executes the `fn` function synchronously within the Angular zone as a task and returns value
         * returned by the function.
         *
         * Running functions via `run` allows you to reenter Angular zone from a task that was executed
         * outside of the Angular zone (typically started via {@link #runOutsideAngular}).
         *
         * Any future tasks or microtasks scheduled from within this function will continue executing from
         * within the Angular zone.
         *
         * If a synchronous error happens it will be rethrown and not reported via `onError`.
         */
        /**
         * Executes the `fn` function synchronously within the Angular zone as a task and returns value
         * returned by the function.
         *
         * Running functions via `run` allows you to reenter Angular zone from a task that was executed
         * outside of the Angular zone (typically started via {\@link #runOutsideAngular}).
         *
         * Any future tasks or microtasks scheduled from within this function will continue executing from
         * within the Angular zone.
         *
         * If a synchronous error happens it will be rethrown and not reported via `onError`.
         * @template T
         * @param {?} fn
         * @param {?=} applyThis
         * @param {?=} applyArgs
         * @param {?=} name
         * @return {?}
         */
        NgZone.prototype.runTask = /**
         * Executes the `fn` function synchronously within the Angular zone as a task and returns value
         * returned by the function.
         *
         * Running functions via `run` allows you to reenter Angular zone from a task that was executed
         * outside of the Angular zone (typically started via {\@link #runOutsideAngular}).
         *
         * Any future tasks or microtasks scheduled from within this function will continue executing from
         * within the Angular zone.
         *
         * If a synchronous error happens it will be rethrown and not reported via `onError`.
         * @template T
         * @param {?} fn
         * @param {?=} applyThis
         * @param {?=} applyArgs
         * @param {?=} name
         * @return {?}
         */
        function (fn, applyThis, applyArgs, name) {
            var /** @type {?} */ zone = (((this)))._inner;
            var /** @type {?} */ task = zone.scheduleEventTask('NgZoneEvent: ' + name, fn, EMPTY_PAYLOAD, noop$1, noop$1);
            try {
                return /** @type {?} */ (zone.runTask(task, applyThis, applyArgs));
            }
            finally {
                zone.cancelTask(task);
            }
        };
        /**
         * Same as `run`, except that synchronous errors are caught and forwarded via `onError` and not
         * rethrown.
         */
        /**
         * Same as `run`, except that synchronous errors are caught and forwarded via `onError` and not
         * rethrown.
         * @template T
         * @param {?} fn
         * @param {?=} applyThis
         * @param {?=} applyArgs
         * @return {?}
         */
        NgZone.prototype.runGuarded = /**
         * Same as `run`, except that synchronous errors are caught and forwarded via `onError` and not
         * rethrown.
         * @template T
         * @param {?} fn
         * @param {?=} applyThis
         * @param {?=} applyArgs
         * @return {?}
         */
        function (fn, applyThis, applyArgs) {
            return /** @type {?} */ ((((this)))._inner.runGuarded(fn, applyThis, applyArgs));
        };
        /**
         * Executes the `fn` function synchronously in Angular's parent zone and returns value returned by
         * the function.
         *
         * Running functions via {@link #runOutsideAngular} allows you to escape Angular's zone and do
         * work that
         * doesn't trigger Angular change-detection or is subject to Angular's error handling.
         *
         * Any future tasks or microtasks scheduled from within this function will continue executing from
         * outside of the Angular zone.
         *
         * Use {@link #run} to reenter the Angular zone and do work that updates the application model.
         */
        /**
         * Executes the `fn` function synchronously in Angular's parent zone and returns value returned by
         * the function.
         *
         * Running functions via {\@link #runOutsideAngular} allows you to escape Angular's zone and do
         * work that
         * doesn't trigger Angular change-detection or is subject to Angular's error handling.
         *
         * Any future tasks or microtasks scheduled from within this function will continue executing from
         * outside of the Angular zone.
         *
         * Use {\@link #run} to reenter the Angular zone and do work that updates the application model.
         * @template T
         * @param {?} fn
         * @return {?}
         */
        NgZone.prototype.runOutsideAngular = /**
         * Executes the `fn` function synchronously in Angular's parent zone and returns value returned by
         * the function.
         *
         * Running functions via {\@link #runOutsideAngular} allows you to escape Angular's zone and do
         * work that
         * doesn't trigger Angular change-detection or is subject to Angular's error handling.
         *
         * Any future tasks or microtasks scheduled from within this function will continue executing from
         * outside of the Angular zone.
         *
         * Use {\@link #run} to reenter the Angular zone and do work that updates the application model.
         * @template T
         * @param {?} fn
         * @return {?}
         */
        function (fn) {
            return /** @type {?} */ ((((this)))._outer.run(fn));
        };
        return NgZone;
    }());

    /**
     * @return {?}
     */
    function noop$1() {
    }

    var EMPTY_PAYLOAD = {};

    /**
     * @param {?} zone
     * @return {?}
     */
    function checkStable(zone) {
        if (zone._nesting == 0 && !zone.hasPendingMicrotasks && !zone.isStable) {
            try {
                zone._nesting++;
                zone.onMicrotaskEmpty.emit(null);
            }
            finally {
                zone._nesting--;
                if (!zone.hasPendingMicrotasks) {
                    try {
                        zone.runOutsideAngular(function () {
                            return zone.onStable.emit(null);
                        });
                    }
                    finally {
                        zone.isStable = true;
                    }
                }
            }
        }
    }

    /**
     * @param {?} zone
     * @return {?}
     */
    function forkInnerZoneWithAngularBehavior(zone) {
        zone._inner = zone._inner.fork({
            name: 'angular',
            properties: /** @type {?} */ ({'isAngularZone': true}),
            onInvokeTask: function (delegate, current, target, task, applyThis, applyArgs) {
                try {
                    onEnter(zone);
                    return delegate.invokeTask(target, task, applyThis, applyArgs);
                }
                finally {
                    onLeave(zone);
                }
            },
            onInvoke: function (delegate, current, target, callback, applyThis, applyArgs, source) {
                try {
                    onEnter(zone);
                    return delegate.invoke(target, callback, applyThis, applyArgs, source);
                }
                finally {
                    onLeave(zone);
                }
            },
            onHasTask: function (delegate, current, target, hasTaskState) {
                delegate.hasTask(target, hasTaskState);
                if (current === target) {
                    // We are only interested in hasTask events which originate from our zone
                    // (A child hasTask event is not interesting to us)
                    if (hasTaskState.change == 'microTask') {
                        zone.hasPendingMicrotasks = hasTaskState.microTask;
                        checkStable(zone);
                    }
                    else if (hasTaskState.change == 'macroTask') {
                        zone.hasPendingMacrotasks = hasTaskState.macroTask;
                    }
                }
            },
            onHandleError: function (delegate, current, target, error) {
                delegate.handleError(target, error);
                zone.runOutsideAngular(function () {
                    return zone.onError.emit(error);
                });
                return false;
            }
        });
    }

    /**
     * @param {?} zone
     * @return {?}
     */
    function onEnter(zone) {
        zone._nesting++;
        if (zone.isStable) {
            zone.isStable = false;
            zone.onUnstable.emit(null);
        }
    }

    /**
     * @param {?} zone
     * @return {?}
     */
    function onLeave(zone) {
        zone._nesting--;
        checkStable(zone);
    }

    /**
     * Provides a noop implementation of `NgZone` which does nothing. This zone requires explicit calls
     * to framework to perform rendering.
     */
    var NoopNgZone = /*@__PURE__*/ (/*@__PURE__*/ function () {
        function NoopNgZone() {
            this.hasPendingMicrotasks = false;
            this.hasPendingMacrotasks = false;
            this.isStable = true;
            this.onUnstable = new EventEmitter();
            this.onMicrotaskEmpty = new EventEmitter();
            this.onStable = new EventEmitter();
            this.onError = new EventEmitter();
        }

        /**
         * @param {?} fn
         * @return {?}
         */
        NoopNgZone.prototype.run = /**
         * @param {?} fn
         * @return {?}
         */
        function (fn) {
            return fn();
        };
        /**
         * @param {?} fn
         * @return {?}
         */
        NoopNgZone.prototype.runGuarded = /**
         * @param {?} fn
         * @return {?}
         */
        function (fn) {
            return fn();
        };
        /**
         * @param {?} fn
         * @return {?}
         */
        NoopNgZone.prototype.runOutsideAngular = /**
         * @param {?} fn
         * @return {?}
         */
        function (fn) {
            return fn();
        };
        /**
         * @template T
         * @param {?} fn
         * @return {?}
         */
        NoopNgZone.prototype.runTask = /**
         * @template T
         * @param {?} fn
         * @return {?}
         */
        function (fn) {
            return fn();
        };
        return NoopNgZone;
    }());
    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * The Testability service provides testing hooks that can be accessed from
     * the browser and by services such as Protractor. Each bootstrapped Angular
     * application on the page will have an instance of Testability.
     * \@experimental
     */
    var Testability = /*@__PURE__*/ (/*@__PURE__*/ function () {
        function Testability(_ngZone) {
            this._ngZone = _ngZone;
            /**
             * \@internal
             */
            this._pendingCount = 0;
            /**
             * \@internal
             */
            this._isZoneStable = true;
            /**
             * Whether any work was done since the last 'whenStable' callback. This is
             * useful to detect if this could have potentially destabilized another
             * component while it is stabilizing.
             * \@internal
             */
            this._didWork = false;
            /**
             * \@internal
             */
            this._callbacks = [];
            this._watchAngularEvents();
        }

        /** @internal */
        /**
         * \@internal
         * @return {?}
         */
        Testability.prototype._watchAngularEvents = /**
         * \@internal
         * @return {?}
         */
        function () {
            var _this = this;
            this._ngZone.onUnstable.subscribe({
                next: function () {
                    _this._didWork = true;
                    _this._isZoneStable = false;
                }
            });
            this._ngZone.runOutsideAngular(function () {
                _this._ngZone.onStable.subscribe({
                    next: function () {
                        NgZone.assertNotInAngularZone();
                        scheduleMicroTask(function () {
                            _this._isZoneStable = true;
                            _this._runCallbacksIfReady();
                        });
                    }
                });
            });
        };
        /**
         * Increases the number of pending request
         */
        /**
         * Increases the number of pending request
         * @return {?}
         */
        Testability.prototype.increasePendingRequestCount = /**
         * Increases the number of pending request
         * @return {?}
         */
        function () {
            this._pendingCount += 1;
            this._didWork = true;
            return this._pendingCount;
        };
        /**
         * Decreases the number of pending request
         */
        /**
         * Decreases the number of pending request
         * @return {?}
         */
        Testability.prototype.decreasePendingRequestCount = /**
         * Decreases the number of pending request
         * @return {?}
         */
        function () {
            this._pendingCount -= 1;
            if (this._pendingCount < 0) {
                throw new Error('pending async requests below zero');
            }
            this._runCallbacksIfReady();
            return this._pendingCount;
        };
        /**
         * Whether an associated application is stable
         */
        /**
         * Whether an associated application is stable
         * @return {?}
         */
        Testability.prototype.isStable = /**
         * Whether an associated application is stable
         * @return {?}
         */
        function () {
            return this._isZoneStable && this._pendingCount == 0 && !this._ngZone.hasPendingMacrotasks;
        };
        /** @internal */
        /**
         * \@internal
         * @return {?}
         */
        Testability.prototype._runCallbacksIfReady = /**
         * \@internal
         * @return {?}
         */
        function () {
            var _this = this;
            if (this.isStable()) {
                // Schedules the call backs in a new frame so that it is always async.
                scheduleMicroTask(function () {
                    while (_this._callbacks.length !== 0) {
                        (((_this._callbacks.pop())))(_this._didWork);
                    }
                    _this._didWork = false;
                });
            }
            else {
                // Not Ready
                this._didWork = true;
            }
        };
        /**
         * Run callback when the application is stable
         * @param callback function to be called after the application is stable
         */
        /**
         * Run callback when the application is stable
         * @param {?} callback function to be called after the application is stable
         * @return {?}
         */
        Testability.prototype.whenStable = /**
         * Run callback when the application is stable
         * @param {?} callback function to be called after the application is stable
         * @return {?}
         */
        function (callback) {
            this._callbacks.push(callback);
            this._runCallbacksIfReady();
        };
        /**
         * Get the number of pending requests
         */
        /**
         * Get the number of pending requests
         * @return {?}
         */
        Testability.prototype.getPendingRequestCount = /**
         * Get the number of pending requests
         * @return {?}
         */
        function () {
            return this._pendingCount;
        };
        /**
         * Find providers by name
         * @param using The root element to search from
         * @param provider The name of binding variable
         * @param exactMatch Whether using exactMatch
         */
        /**
         * Find providers by name
         * @param {?} using The root element to search from
         * @param {?} provider The name of binding variable
         * @param {?} exactMatch Whether using exactMatch
         * @return {?}
         */
        Testability.prototype.findProviders = /**
         * Find providers by name
         * @param {?} using The root element to search from
         * @param {?} provider The name of binding variable
         * @param {?} exactMatch Whether using exactMatch
         * @return {?}
         */
        function (using, provider, exactMatch) {
            // TODO(juliemr): implement.
            return [];
        };
        return Testability;
    }());
    /**
     * A global registry of {\@link Testability} instances for specific elements.
     * \@experimental
     */
    var TestabilityRegistry = /*@__PURE__*/ (/*@__PURE__*/ function () {
        function TestabilityRegistry() {
            /**
             * \@internal
             */
            this._applications = new Map();
            _testabilityGetter.addToWindow(this);
        }

        /**
         * Registers an application with a testability hook so that it can be tracked
         * @param token token of application, root element
         * @param testability Testability hook
         */
        /**
         * Registers an application with a testability hook so that it can be tracked
         * @param {?} token token of application, root element
         * @param {?} testability Testability hook
         * @return {?}
         */
        TestabilityRegistry.prototype.registerApplication = /**
         * Registers an application with a testability hook so that it can be tracked
         * @param {?} token token of application, root element
         * @param {?} testability Testability hook
         * @return {?}
         */
        function (token, testability) {
            this._applications.set(token, testability);
        };
        /**
         * Unregisters an application.
         * @param token token of application, root element
         */
        /**
         * Unregisters an application.
         * @param {?} token token of application, root element
         * @return {?}
         */
        TestabilityRegistry.prototype.unregisterApplication = /**
         * Unregisters an application.
         * @param {?} token token of application, root element
         * @return {?}
         */
        function (token) {
            this._applications.delete(token);
        };
        /**
         * Unregisters all applications
         */
        /**
         * Unregisters all applications
         * @return {?}
         */
        TestabilityRegistry.prototype.unregisterAllApplications = /**
         * Unregisters all applications
         * @return {?}
         */
        function () {
            this._applications.clear();
        };
        /**
         * Get a testability hook associated with the application
         * @param elem root element
         */
        /**
         * Get a testability hook associated with the application
         * @param {?} elem root element
         * @return {?}
         */
        TestabilityRegistry.prototype.getTestability = /**
         * Get a testability hook associated with the application
         * @param {?} elem root element
         * @return {?}
         */
        function (elem) {
            return this._applications.get(elem) || null;
        };
        /**
         * Get all registered testabilities
         */
        /**
         * Get all registered testabilities
         * @return {?}
         */
        TestabilityRegistry.prototype.getAllTestabilities = /**
         * Get all registered testabilities
         * @return {?}
         */
        function () {
            return Array.from(this._applications.values());
        };
        /**
         * Get all registered applications(root elements)
         */
        /**
         * Get all registered applications(root elements)
         * @return {?}
         */
        TestabilityRegistry.prototype.getAllRootElements = /**
         * Get all registered applications(root elements)
         * @return {?}
         */
        function () {
            return Array.from(this._applications.keys());
        };
        /**
         * Find testability of a node in the Tree
         * @param elem node
         * @param findInAncestors whether finding testability in ancestors if testability was not found in
         * current node
         */
        /**
         * Find testability of a node in the Tree
         * @param {?} elem node
         * @param {?=} findInAncestors whether finding testability in ancestors if testability was not found in
         * current node
         * @return {?}
         */
        TestabilityRegistry.prototype.findTestabilityInTree = /**
         * Find testability of a node in the Tree
         * @param {?} elem node
         * @param {?=} findInAncestors whether finding testability in ancestors if testability was not found in
         * current node
         * @return {?}
         */
        function (elem, findInAncestors) {
            if (findInAncestors === void 0) {
                findInAncestors = true;
            }
            return _testabilityGetter.findTestabilityInTree(this, elem, findInAncestors);
        };
        /** @nocollapse */
        TestabilityRegistry.ctorParameters = function () {
            return [];
        };
        return TestabilityRegistry;
    }());
    /**
     * Adapter interface for retrieving the `Testability` service associated for a
     * particular context.
     *
     * \@experimental Testability apis are primarily intended to be used by e2e test tool vendors like
     * the Protractor team.
     * @record
     */
    var _NoopGetTestability = /*@__PURE__*/ (/*@__PURE__*/ function () {
        function _NoopGetTestability() {
        }

        /**
         * @param {?} registry
         * @return {?}
         */
        _NoopGetTestability.prototype.addToWindow = /**
         * @param {?} registry
         * @return {?}
         */
        function (registry) {
        };
        /**
         * @param {?} registry
         * @param {?} elem
         * @param {?} findInAncestors
         * @return {?}
         */
        _NoopGetTestability.prototype.findTestabilityInTree = /**
         * @param {?} registry
         * @param {?} elem
         * @param {?} findInAncestors
         * @return {?}
         */
        function (registry, elem, findInAncestors) {
            return null;
        };
        return _NoopGetTestability;
    }());
    var _testabilityGetter = /*@__PURE__*/ new _NoopGetTestability();
    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var _devMode = true;

    /**
     * Returns whether Angular is in development mode. After called once,
     * the value is locked and won't change any more.
     *
     * By default, this is true, unless a user calls `enableProdMode` before calling this.
     *
     * \@experimental APIs related to application bootstrap are currently under review.
     * @return {?}
     */
    function isDevMode() {
        return _devMode;
    }

    /**
     * Provides additional options to the bootstraping process.
     *
     * \@stable
     * @record
     */
    /**
     * The Angular platform is the entry point for Angular on a web page. Each page
     * has exactly one platform, and services (such as reflection) which are common
     * to every Angular application running on the page are bound in its scope.
     *
     * A page's platform is initialized implicitly when a platform is created via a platform factory
     * (e.g. {\@link platformBrowser}), or explicitly by calling the {\@link createPlatform} function.
     *
     * \@stable
     */
    var PlatformRef = /*@__PURE__*/ (/*@__PURE__*/ function () {
        /** @internal */
        function PlatformRef(_injector) {
            this._injector = _injector;
            this._modules = [];
            this._destroyListeners = [];
            this._destroyed = false;
        }

        /**
         * Creates an instance of an `@NgModule` for the given platform
         * for offline compilation.
         *
         * ## Simple Example
         *
         * ```typescript
         * my_module.ts:
         *
         * @NgModule({
         *   imports: [BrowserModule]
         * })
         * class MyModule {}
         *
         * main.ts:
         * import {MyModuleNgFactory} from './my_module.ngfactory';
         * import {platformBrowser} from '@angular/platform-browser';
         *
         * let moduleRef = platformBrowser().bootstrapModuleFactory(MyModuleNgFactory);
         * ```
         *
         * @experimental APIs related to application bootstrap are currently under review.
         */
        /**
         * Creates an instance of an `\@NgModule` for the given platform
         * for offline compilation.
         *
         * ## Simple Example
         *
         * ```typescript
         * my_module.ts:
         *
         * \@NgModule({
         *   imports: [BrowserModule]
         * })
         * class MyModule {}
         *
         * main.ts:
         * import {MyModuleNgFactory} from './my_module.ngfactory';
         * import {platformBrowser} from '\@angular/platform-browser';
         *
         * let moduleRef = platformBrowser().bootstrapModuleFactory(MyModuleNgFactory);
         * ```
         *
         * \@experimental APIs related to application bootstrap are currently under review.
         * @template M
         * @param {?} moduleFactory
         * @param {?=} options
         * @return {?}
         */
        PlatformRef.prototype.bootstrapModuleFactory = /**
         * Creates an instance of an `\@NgModule` for the given platform
         * for offline compilation.
         *
         * ## Simple Example
         *
         * ```typescript
         * my_module.ts:
         *
         * \@NgModule({
         *   imports: [BrowserModule]
         * })
         * class MyModule {}
         *
         * main.ts:
         * import {MyModuleNgFactory} from './my_module.ngfactory';
         * import {platformBrowser} from '\@angular/platform-browser';
         *
         * let moduleRef = platformBrowser().bootstrapModuleFactory(MyModuleNgFactory);
         * ```
         *
         * \@experimental APIs related to application bootstrap are currently under review.
         * @template M
         * @param {?} moduleFactory
         * @param {?=} options
         * @return {?}
         */
        function (moduleFactory, options) {
            var _this = this;
            // Note: We need to create the NgZone _before_ we instantiate the module,
            // as instantiating the module creates some providers eagerly.
            // So we create a mini parent injector that just contains the new NgZone and
            // pass that as parent to the NgModuleFactory.
            var /** @type {?} */ ngZoneOption = options ? options.ngZone : undefined;
            var /** @type {?} */ ngZone = getNgZone(ngZoneOption);
            var /** @type {?} */ providers = [{provide: NgZone, useValue: ngZone}];
            // Attention: Don't use ApplicationRef.run here,
            // as we want to be sure that all possible constructor calls are inside `ngZone.run`!
            return ngZone.run(function () {
                var /** @type {?} */ ngZoneInjector = Injector.create({
                    providers: providers,
                    parent: _this.injector,
                    name: moduleFactory.moduleType.name
                });
                var /** @type {?} */ moduleRef = (moduleFactory.create(ngZoneInjector));
                var /** @type {?} */ exceptionHandler = moduleRef.injector.get(ErrorHandler, null);
                if (!exceptionHandler) {
                    throw new Error('No ErrorHandler. Is platform module (BrowserModule) included?');
                }
                moduleRef.onDestroy(function () {
                    return remove(_this._modules, moduleRef);
                });
                /** @type {?} */
                ((ngZone)).runOutsideAngular(function () {
                    return ((ngZone)).onError.subscribe({
                        next: function (error) {
                            exceptionHandler.handleError(error);
                        }
                    });
                });
                return _callAndReportToErrorHandler(exceptionHandler, /** @type {?} */ ((ngZone)), function () {
                    var /** @type {?} */ initStatus = moduleRef.injector.get(ApplicationInitStatus);
                    initStatus.runInitializers();
                    return initStatus.donePromise.then(function () {
                        _this._moduleDoBootstrap(moduleRef);
                        return moduleRef;
                    });
                });
            });
        };
        /**
         * Creates an instance of an `@NgModule` for a given platform using the given runtime compiler.
         *
         * ## Simple Example
         *
         * ```typescript
         * @NgModule({
         *   imports: [BrowserModule]
         * })
         * class MyModule {}
         *
         * let moduleRef = platformBrowser().bootstrapModule(MyModule);
         * ```
         * @stable
         */
        /**
         * Creates an instance of an `\@NgModule` for a given platform using the given runtime compiler.
         *
         * ## Simple Example
         *
         * ```typescript
         * \@NgModule({
         *   imports: [BrowserModule]
         * })
         * class MyModule {}
         *
         * let moduleRef = platformBrowser().bootstrapModule(MyModule);
         * ```
         * \@stable
         * @template M
         * @param {?} moduleType
         * @param {?=} compilerOptions
         * @return {?}
         */
        PlatformRef.prototype.bootstrapModule = /**
         * Creates an instance of an `\@NgModule` for a given platform using the given runtime compiler.
         *
         * ## Simple Example
         *
         * ```typescript
         * \@NgModule({
         *   imports: [BrowserModule]
         * })
         * class MyModule {}
         *
         * let moduleRef = platformBrowser().bootstrapModule(MyModule);
         * ```
         * \@stable
         * @template M
         * @param {?} moduleType
         * @param {?=} compilerOptions
         * @return {?}
         */
        function (moduleType, compilerOptions) {
            var _this = this;
            if (compilerOptions === void 0) {
                compilerOptions = [];
            }
            var /** @type {?} */ compilerFactory = this.injector.get(CompilerFactory);
            var /** @type {?} */ options = optionsReducer({}, compilerOptions);
            var /** @type {?} */ compiler = compilerFactory.createCompiler([options]);
            return compiler.compileModuleAsync(moduleType)
                .then(function (moduleFactory) {
                    return _this.bootstrapModuleFactory(moduleFactory, options);
                });
        };
        /**
         * @param {?} moduleRef
         * @return {?}
         */
        PlatformRef.prototype._moduleDoBootstrap = /**
         * @param {?} moduleRef
         * @return {?}
         */
        function (moduleRef) {
            var /** @type {?} */ appRef = (moduleRef.injector.get(ApplicationRef));
            if (moduleRef._bootstrapComponents.length > 0) {
                moduleRef._bootstrapComponents.forEach(function (f) {
                    return appRef.bootstrap(f);
                });
            }
            else if (moduleRef.instance.ngDoBootstrap) {
                moduleRef.instance.ngDoBootstrap(appRef);
            }
            else {
                throw new Error("The module " + stringify(moduleRef.instance.constructor) + " was bootstrapped, but it does not declare \"@NgModule.bootstrap\" components nor a \"ngDoBootstrap\" method. " +
                    "Please define one of these.");
            }
            this._modules.push(moduleRef);
        };
        /**
         * Register a listener to be called when the platform is disposed.
         */
        /**
         * Register a listener to be called when the platform is disposed.
         * @param {?} callback
         * @return {?}
         */
        PlatformRef.prototype.onDestroy = /**
         * Register a listener to be called when the platform is disposed.
         * @param {?} callback
         * @return {?}
         */
        function (callback) {
            this._destroyListeners.push(callback);
        };
        Object.defineProperty(PlatformRef.prototype, "injector", {
            /**
             * Retrieve the platform {@link Injector}, which is the parent injector for
             * every Angular application on the page and provides singleton providers.
             */
            get: /**
             * Retrieve the platform {\@link Injector}, which is the parent injector for
             * every Angular application on the page and provides singleton providers.
             * @return {?}
             */ function () {
                return this._injector;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Destroy the Angular platform and all Angular applications on the page.
         */
        /**
         * Destroy the Angular platform and all Angular applications on the page.
         * @return {?}
         */
        PlatformRef.prototype.destroy = /**
         * Destroy the Angular platform and all Angular applications on the page.
         * @return {?}
         */
        function () {
            if (this._destroyed) {
                throw new Error('The platform has already been destroyed!');
            }
            this._modules.slice().forEach(function (module) {
                return module.destroy();
            });
            this._destroyListeners.forEach(function (listener) {
                return listener();
            });
            this._destroyed = true;
        };
        Object.defineProperty(PlatformRef.prototype, "destroyed", {
            get: /**
             * @return {?}
             */ function () {
                return this._destroyed;
            },
            enumerable: true,
            configurable: true
        });
        return PlatformRef;
    }());

    /**
     * @param {?=} ngZoneOption
     * @return {?}
     */
    function getNgZone(ngZoneOption) {
        var /** @type {?} */ ngZone;
        if (ngZoneOption === 'noop') {
            ngZone = new NoopNgZone();
        }
        else {
            ngZone = (ngZoneOption === 'zone.js' ? undefined : ngZoneOption) ||
                new NgZone({enableLongStackTrace: isDevMode()});
        }
        return ngZone;
    }

    /**
     * @param {?} errorHandler
     * @param {?} ngZone
     * @param {?} callback
     * @return {?}
     */
    function _callAndReportToErrorHandler(errorHandler, ngZone, callback) {
        try {
            var /** @type {?} */ result = callback();
            if (isPromise$1(result)) {
                return result.catch(function (e) {
                    ngZone.runOutsideAngular(function () {
                        return errorHandler.handleError(e);
                    });
                    // rethrow as the exception handler might not do it
                    throw e;
                });
            }
            return result;
        }
        catch (e) {
            ngZone.runOutsideAngular(function () {
                return errorHandler.handleError(e);
            });
            // rethrow as the exception handler might not do it
            throw e;
        }
    }

    /**
     * @template T
     * @param {?} dst
     * @param {?} objs
     * @return {?}
     */
    function optionsReducer(dst, objs) {
        if (Array.isArray(objs)) {
            dst = objs.reduce(optionsReducer, dst);
        }
        else {
            dst = __assign({}, dst, ((objs)));
        }
        return dst;
    }

    /**
     * A reference to an Angular application running on a page.
     *
     * \@stable
     */
    var ApplicationRef = /*@__PURE__*/ (/*@__PURE__*/ function () {
        /** @internal */
        function ApplicationRef(_zone, _console, _injector, _exceptionHandler, _componentFactoryResolver, _initStatus) {
            var _this = this;
            this._zone = _zone;
            this._console = _console;
            this._injector = _injector;
            this._exceptionHandler = _exceptionHandler;
            this._componentFactoryResolver = _componentFactoryResolver;
            this._initStatus = _initStatus;
            this._bootstrapListeners = [];
            this._views = [];
            this._runningTick = false;
            this._enforceNoNewChanges = false;
            this._stable = true;
            /**
             * Get a list of component types registered to this application.
             * This list is populated even before the component is created.
             */
            this.componentTypes = [];
            /**
             * Get a list of components registered to this application.
             */
            this.components = [];
            this._enforceNoNewChanges = isDevMode();
            this._zone.onMicrotaskEmpty.subscribe({
                next: function () {
                    _this._zone.run(function () {
                        _this.tick();
                    });
                }
            });
            var /** @type {?} */ isCurrentlyStable = new Observable(function (observer) {
                _this._stable = _this._zone.isStable && !_this._zone.hasPendingMacrotasks &&
                    !_this._zone.hasPendingMicrotasks;
                _this._zone.runOutsideAngular(function () {
                    observer.next(_this._stable);
                    observer.complete();
                });
            });
            var /** @type {?} */ isStable = new Observable(function (observer) {
                // Create the subscription to onStable outside the Angular Zone so that
                // the callback is run outside the Angular Zone.
                var /** @type {?} */ stableSub;
                _this._zone.runOutsideAngular(function () {
                    stableSub = _this._zone.onStable.subscribe(function () {
                        NgZone.assertNotInAngularZone();
                        // Check whether there are no pending macro/micro tasks in the next tick
                        // to allow for NgZone to update the state.
                        scheduleMicroTask(function () {
                            if (!_this._stable && !_this._zone.hasPendingMacrotasks &&
                                !_this._zone.hasPendingMicrotasks) {
                                _this._stable = true;
                                observer.next(true);
                            }
                        });
                    });
                });
                var /** @type {?} */ unstableSub = _this._zone.onUnstable.subscribe(function () {
                    NgZone.assertInAngularZone();
                    if (_this._stable) {
                        _this._stable = false;
                        _this._zone.runOutsideAngular(function () {
                            observer.next(false);
                        });
                    }
                });
                return function () {
                    stableSub.unsubscribe();
                    unstableSub.unsubscribe();
                };
            });
            ((this)).isStable =
                merge(isCurrentlyStable, share$1.call(isStable));
        }

        /**
         * Bootstrap a new component at the root level of the application.
         *
         * ### Bootstrap process
         *
         * When bootstrapping a new root component into an application, Angular mounts the
         * specified application component onto DOM elements identified by the [componentType]'s
         * selector and kicks off automatic change detection to finish initializing the component.
         *
         * Optionally, a component can be mounted onto a DOM element that does not match the
         * [componentType]'s selector.
         *
         * ### Example
         * {@example core/ts/platform/platform.ts region='longform'}
         */
        /**
         * Bootstrap a new component at the root level of the application.
         *
         * ### Bootstrap process
         *
         * When bootstrapping a new root component into an application, Angular mounts the
         * specified application component onto DOM elements identified by the [componentType]'s
         * selector and kicks off automatic change detection to finish initializing the component.
         *
         * Optionally, a component can be mounted onto a DOM element that does not match the
         * [componentType]'s selector.
         *
         * ### Example
         * {\@example core/ts/platform/platform.ts region='longform'}
         * @template C
         * @param {?} componentOrFactory
         * @param {?=} rootSelectorOrNode
         * @return {?}
         */
        ApplicationRef.prototype.bootstrap = /**
         * Bootstrap a new component at the root level of the application.
         *
         * ### Bootstrap process
         *
         * When bootstrapping a new root component into an application, Angular mounts the
         * specified application component onto DOM elements identified by the [componentType]'s
         * selector and kicks off automatic change detection to finish initializing the component.
         *
         * Optionally, a component can be mounted onto a DOM element that does not match the
         * [componentType]'s selector.
         *
         * ### Example
         * {\@example core/ts/platform/platform.ts region='longform'}
         * @template C
         * @param {?} componentOrFactory
         * @param {?=} rootSelectorOrNode
         * @return {?}
         */
        function (componentOrFactory, rootSelectorOrNode) {
            var _this = this;
            if (!this._initStatus.done) {
                throw new Error('Cannot bootstrap as there are still asynchronous initializers running. Bootstrap components in the `ngDoBootstrap` method of the root module.');
            }
            var /** @type {?} */ componentFactory;
            if (componentOrFactory instanceof ComponentFactory) {
                componentFactory = componentOrFactory;
            }
            else {
                componentFactory =
                    /** @type {?} */ ((this._componentFactoryResolver.resolveComponentFactory(componentOrFactory)));
            }
            this.componentTypes.push(componentFactory.componentType);
            // Create a factory associated with the current module if it's not bound to some other
            var /** @type {?} */ ngModule = componentFactory instanceof ComponentFactoryBoundToModule ?
                null :
                this._injector.get(NgModuleRef);
            var /** @type {?} */ selectorOrNode = rootSelectorOrNode || componentFactory.selector;
            var /** @type {?} */ compRef = componentFactory.create(Injector.NULL, [], selectorOrNode, ngModule);
            compRef.onDestroy(function () {
                _this._unloadComponent(compRef);
            });
            var /** @type {?} */ testability = compRef.injector.get(Testability, null);
            if (testability) {
                compRef.injector.get(TestabilityRegistry)
                    .registerApplication(compRef.location.nativeElement, testability);
            }
            this._loadComponent(compRef);
            if (isDevMode()) {
                this._console.log("Angular is running in the development mode. Call enableProdMode() to enable the production mode.");
            }
            return compRef;
        };
        /**
         * Invoke this method to explicitly process change detection and its side-effects.
         *
         * In development mode, `tick()` also performs a second change detection cycle to ensure that no
         * further changes are detected. If additional changes are picked up during this second cycle,
         * bindings in the app have side-effects that cannot be resolved in a single change detection
         * pass.
         * In this case, Angular throws an error, since an Angular application can only have one change
         * detection pass during which all change detection must complete.
         */
        /**
         * Invoke this method to explicitly process change detection and its side-effects.
         *
         * In development mode, `tick()` also performs a second change detection cycle to ensure that no
         * further changes are detected. If additional changes are picked up during this second cycle,
         * bindings in the app have side-effects that cannot be resolved in a single change detection
         * pass.
         * In this case, Angular throws an error, since an Angular application can only have one change
         * detection pass during which all change detection must complete.
         * @return {?}
         */
        ApplicationRef.prototype.tick = /**
         * Invoke this method to explicitly process change detection and its side-effects.
         *
         * In development mode, `tick()` also performs a second change detection cycle to ensure that no
         * further changes are detected. If additional changes are picked up during this second cycle,
         * bindings in the app have side-effects that cannot be resolved in a single change detection
         * pass.
         * In this case, Angular throws an error, since an Angular application can only have one change
         * detection pass during which all change detection must complete.
         * @return {?}
         */
        function () {
            var _this = this;
            if (this._runningTick) {
                throw new Error('ApplicationRef.tick is called recursively');
            }
            var /** @type {?} */ scope = ApplicationRef._tickScope();
            try {
                this._runningTick = true;
                this._views.forEach(function (view) {
                    return view.detectChanges();
                });
                if (this._enforceNoNewChanges) {
                    this._views.forEach(function (view) {
                        return view.checkNoChanges();
                    });
                }
            }
            catch (e) {
                // Attention: Don't rethrow as it could cancel subscriptions to Observables!
                this._zone.runOutsideAngular(function () {
                    return _this._exceptionHandler.handleError(e);
                });
            }
            finally {
                this._runningTick = false;
                wtfLeave(scope);
            }
        };
        /**
         * Attaches a view so that it will be dirty checked.
         * The view will be automatically detached when it is destroyed.
         * This will throw if the view is already attached to a ViewContainer.
         */
        /**
         * Attaches a view so that it will be dirty checked.
         * The view will be automatically detached when it is destroyed.
         * This will throw if the view is already attached to a ViewContainer.
         * @param {?} viewRef
         * @return {?}
         */
        ApplicationRef.prototype.attachView = /**
         * Attaches a view so that it will be dirty checked.
         * The view will be automatically detached when it is destroyed.
         * This will throw if the view is already attached to a ViewContainer.
         * @param {?} viewRef
         * @return {?}
         */
        function (viewRef) {
            var /** @type {?} */ view = ((viewRef));
            this._views.push(view);
            view.attachToAppRef(this);
        };
        /**
         * Detaches a view from dirty checking again.
         */
        /**
         * Detaches a view from dirty checking again.
         * @param {?} viewRef
         * @return {?}
         */
        ApplicationRef.prototype.detachView = /**
         * Detaches a view from dirty checking again.
         * @param {?} viewRef
         * @return {?}
         */
        function (viewRef) {
            var /** @type {?} */ view = ((viewRef));
            remove(this._views, view);
            view.detachFromAppRef();
        };
        /**
         * @param {?} componentRef
         * @return {?}
         */
        ApplicationRef.prototype._loadComponent = /**
         * @param {?} componentRef
         * @return {?}
         */
        function (componentRef) {
            this.attachView(componentRef.hostView);
            this.tick();
            this.components.push(componentRef);
            // Get the listeners lazily to prevent DI cycles.
            var /** @type {?} */ listeners = this._injector.get(APP_BOOTSTRAP_LISTENER, []).concat(this._bootstrapListeners);
            listeners.forEach(function (listener) {
                return listener(componentRef);
            });
        };
        /**
         * @param {?} componentRef
         * @return {?}
         */
        ApplicationRef.prototype._unloadComponent = /**
         * @param {?} componentRef
         * @return {?}
         */
        function (componentRef) {
            this.detachView(componentRef.hostView);
            remove(this.components, componentRef);
        };
        /** @internal */
        /**
         * \@internal
         * @return {?}
         */
        ApplicationRef.prototype.ngOnDestroy = /**
         * \@internal
         * @return {?}
         */
        function () {
            // TODO(alxhub): Dispose of the NgZone.
            this._views.slice().forEach(function (view) {
                return view.destroy();
            });
        };
        Object.defineProperty(ApplicationRef.prototype, "viewCount", {
            /**
             * Returns the number of attached views.
             */
            get: /**
             * Returns the number of attached views.
             * @return {?}
             */ function () {
                return this._views.length;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * \@internal
         */
        ApplicationRef._tickScope = wtfCreateScope('ApplicationRef#tick()');
        return ApplicationRef;
    }());

    /**
     * @template T
     * @param {?} list
     * @param {?} el
     * @return {?}
     */
    function remove(list, el) {
        var /** @type {?} */ index = list.indexOf(el);
        if (index > -1) {
            list.splice(index, 1);
        }
    }

    /**
     * @deprecated Use the `Renderer2` instead.
     * @record
     */
    /**
     * @deprecated Use the `Renderer2` instead.
     * @abstract
     */
    var Renderer = /*@__PURE__*/ (/*@__PURE__*/ function () {
        function Renderer() {
        }

        return Renderer;
    }());
    /**
     * \@experimental
     * @record
     */
    /**
     * \@experimental
     * @abstract
     */
    var RendererFactory2 = /*@__PURE__*/ (/*@__PURE__*/ function () {
        function RendererFactory2() {
        }

        return RendererFactory2;
    }());
    /**
     * \@experimental
     * @abstract
     */
    var Renderer2 = /*@__PURE__*/ (/*@__PURE__*/ function () {
        function Renderer2() {
        }

        return Renderer2;
    }());
    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * A wrapper around a native element inside of a View.
     *
     * An `ElementRef` is backed by a render-specific element. In the browser, this is usually a DOM
     * element.
     *
     * \@security Permitting direct access to the DOM can make your application more vulnerable to
     * XSS attacks. Carefully review any use of `ElementRef` in your code. For more detail, see the
     * [Security Guide](http://g.co/ng/security).
     *
     * \@stable
     */
    var ElementRef = /*@__PURE__*/ (/*@__PURE__*/ function () {
        function ElementRef(nativeElement) {
            this.nativeElement = nativeElement;
        }

        return ElementRef;
    }());
    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * An unmodifiable list of items that Angular keeps up to date when the state
     * of the application changes.
     *
     * The type of object that {\@link ViewChildren}, {\@link ContentChildren}, and {\@link QueryList}
     * provide.
     *
     * Implements an iterable interface, therefore it can be used in both ES6
     * javascript `for (var i of items)` loops as well as in Angular templates with
     * `*ngFor="let i of myList"`.
     *
     * Changes can be observed by subscribing to the changes `Observable`.
     *
     * NOTE: In the future this class will implement an `Observable` interface.
     *
     * ### Example ([live demo](http://plnkr.co/edit/RX8sJnQYl9FWuSCWme5z?p=preview))
     * ```typescript
     * \@Component({...})
     * class Container {
     *   \@ViewChildren(Item) items:QueryList<Item>;
     * }
     * ```
     * \@stable
     */
    var QueryList = /*@__PURE__*/ (/*@__PURE__*/ function () {
        function QueryList() {
            this.dirty = true;
            this._results = [];
            this.changes = new EventEmitter();
            this.length = 0;
        }

        /**
         * See
         * [Array.map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
         */
        /**
         * See
         * [Array.map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
         * @template U
         * @param {?} fn
         * @return {?}
         */
        QueryList.prototype.map = /**
         * See
         * [Array.map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
         * @template U
         * @param {?} fn
         * @return {?}
         */
        function (fn) {
            return this._results.map(fn);
        };
        /**
         * See
         * [Array.filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
         */
        /**
         * See
         * [Array.filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
         * @param {?} fn
         * @return {?}
         */
        QueryList.prototype.filter = /**
         * See
         * [Array.filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
         * @param {?} fn
         * @return {?}
         */
        function (fn) {
            return this._results.filter(fn);
        };
        /**
         * See
         * [Array.find](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find)
         */
        /**
         * See
         * [Array.find](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find)
         * @param {?} fn
         * @return {?}
         */
        QueryList.prototype.find = /**
         * See
         * [Array.find](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find)
         * @param {?} fn
         * @return {?}
         */
        function (fn) {
            return this._results.find(fn);
        };
        /**
         * See
         * [Array.reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)
         */
        /**
         * See
         * [Array.reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)
         * @template U
         * @param {?} fn
         * @param {?} init
         * @return {?}
         */
        QueryList.prototype.reduce = /**
         * See
         * [Array.reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)
         * @template U
         * @param {?} fn
         * @param {?} init
         * @return {?}
         */
        function (fn, init) {
            return this._results.reduce(fn, init);
        };
        /**
         * See
         * [Array.forEach](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)
         */
        /**
         * See
         * [Array.forEach](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)
         * @param {?} fn
         * @return {?}
         */
        QueryList.prototype.forEach = /**
         * See
         * [Array.forEach](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)
         * @param {?} fn
         * @return {?}
         */
        function (fn) {
            this._results.forEach(fn);
        };
        /**
         * See
         * [Array.some](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some)
         */
        /**
         * See
         * [Array.some](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some)
         * @param {?} fn
         * @return {?}
         */
        QueryList.prototype.some = /**
         * See
         * [Array.some](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some)
         * @param {?} fn
         * @return {?}
         */
        function (fn) {
            return this._results.some(fn);
        };
        /**
         * @return {?}
         */
        QueryList.prototype.toArray = /**
         * @return {?}
         */
        function () {
            return this._results.slice();
        };
        /**
         * @return {?}
         */
        QueryList.prototype[getSymbolIterator()] = /**
         * @return {?}
         */
        function () {
            return ((this._results))[getSymbolIterator()]();
        };
        /**
         * @return {?}
         */
        QueryList.prototype.toString = /**
         * @return {?}
         */
        function () {
            return this._results.toString();
        };
        /**
         * @param {?} res
         * @return {?}
         */
        QueryList.prototype.reset = /**
         * @param {?} res
         * @return {?}
         */
        function (res) {
            this._results = flatten(res);
            ((this)).dirty = false;
            ((this)).length = this._results.length;
            ((this)).last = this._results[this.length - 1];
            ((this)).first = this._results[0];
        };
        /**
         * @return {?}
         */
        QueryList.prototype.notifyOnChanges = /**
         * @return {?}
         */
        function () {
            ((this.changes)).emit(this);
        };
        /** internal */
        /**
         * internal
         * @return {?}
         */
        QueryList.prototype.setDirty = /**
         * internal
         * @return {?}
         */
        function () {
            ((this)).dirty = true;
        };
        /** internal */
        /**
         * internal
         * @return {?}
         */
        QueryList.prototype.destroy = /**
         * internal
         * @return {?}
         */
        function () {
            ((this.changes)).complete();
            ((this.changes)).unsubscribe();
        };
        return QueryList;
    }());

    /**
     * @template T
     * @param {?} list
     * @return {?}
     */
    function flatten(list) {
        return list.reduce(function (flat, item) {
            var /** @type {?} */ flatItem = Array.isArray(item) ? flatten(item) : item;
            return ((flat)).concat(flatItem);
        }, []);
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * Represents an Embedded Template that can be used to instantiate Embedded Views.
     *
     * You can access a `TemplateRef`, in two ways. Via a directive placed on a `<ng-template>` element
     * (or directive prefixed with `*`) and have the `TemplateRef` for this Embedded View injected into
     * the constructor of the directive using the `TemplateRef` Token. Alternatively you can query for
     * the `TemplateRef` from a Component or a Directive via {\@link Query}.
     *
     * To instantiate Embedded Views based on a Template, use {\@link ViewContainerRef#
     * createEmbeddedView}, which will create the View and attach it to the View Container.
     * \@stable
     * @abstract
     */
    var TemplateRef = /*@__PURE__*/ (/*@__PURE__*/ function () {
        function TemplateRef() {
        }

        return TemplateRef;
    }());
    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * Represents a container where one or more Views can be attached.
     *
     * The container can contain two kinds of Views. Host Views, created by instantiating a
     * {\@link Component} via {\@link #createComponent}, and Embedded Views, created by instantiating an
     * {\@link TemplateRef Embedded Template} via {\@link #createEmbeddedView}.
     *
     * The location of the View Container within the containing View is specified by the Anchor
     * `element`. Each View Container can have only one Anchor Element and each Anchor Element can only
     * have a single View Container.
     *
     * Root elements of Views attached to this container become siblings of the Anchor Element in
     * the Rendered View.
     *
     * To access a `ViewContainerRef` of an Element, you can either place a {\@link Directive} injected
     * with `ViewContainerRef` on the Element, or you obtain it via a {\@link ViewChild} query.
     * \@stable
     * @abstract
     */
    var ViewContainerRef = /*@__PURE__*/ (/*@__PURE__*/ function () {
        function ViewContainerRef() {
        }

        return ViewContainerRef;
    }());
    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * \@stable
     * @abstract
     */
    var ChangeDetectorRef = /*@__PURE__*/ (/*@__PURE__*/ function () {
        function ChangeDetectorRef() {
        }

        return ChangeDetectorRef;
    }());
    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * \@stable
     * @abstract
     */
    var ViewRef = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
        __extends(ViewRef, _super);

        function ViewRef() {
            return _super !== null && _super.apply(this, arguments) || this;
        }

        return ViewRef;
    }(ChangeDetectorRef));
    /**
     * Represents an Angular View.
     *
     * <!-- TODO: move the next two paragraphs to the dev guide -->
     * A View is a fundamental building block of the application UI. It is the smallest grouping of
     * Elements which are created and destroyed together.
     *
     * Properties of elements in a View can change, but the structure (number and order) of elements in
     * a View cannot. Changing the structure of Elements can only be done by inserting, moving or
     * removing nested Views via a {\@link ViewContainerRef}. Each View can contain many View Containers.
     * <!-- /TODO -->
     *
     * ### Example
     *
     * Given this template...
     *
     * ```
     * Count: {{items.length}}
     * <ul>
     *   <li *ngFor="let  item of items">{{item}}</li>
     * </ul>
     * ```
     *
     * We have two {\@link TemplateRef}s:
     *
     * Outer {\@link TemplateRef}:
     * ```
     * Count: {{items.length}}
     * <ul>
     *   <ng-template ngFor let-item [ngForOf]="items"></ng-template>
     * </ul>
     * ```
     *
     * Inner {\@link TemplateRef}:
     * ```
     *   <li>{{item}}</li>
     * ```
     *
     * Notice that the original template is broken down into two separate {\@link TemplateRef}s.
     *
     * The outer/inner {\@link TemplateRef}s are then assembled into views like so:
     *
     * ```
     * <!-- ViewRef: outer-0 -->
     * Count: 2
     * <ul>
     *   <ng-template view-container-ref></ng-template>
     *   <!-- ViewRef: inner-1 --><li>first</li><!-- /ViewRef: inner-1 -->
     *   <!-- ViewRef: inner-2 --><li>second</li><!-- /ViewRef: inner-2 -->
     * </ul>
     * <!-- /ViewRef: outer-0 -->
     * ```
     * \@experimental
     * @abstract
     */
    var EmbeddedViewRef = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
        __extends(EmbeddedViewRef, _super);

        function EmbeddedViewRef() {
            return _super !== null && _super.apply(this, arguments) || this;
        }

        return EmbeddedViewRef;
    }(ViewRef));
    /**
     * @record
     */
    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var EventListener = /*@__PURE__*/ (/*@__PURE__*/ function () {
        function EventListener(name, callback) {
            this.name = name;
            this.callback = callback;
        }

        return EventListener;
    }());
    /**
     * \@experimental All debugging apis are currently experimental.
     */
    var DebugNode = /*@__PURE__*/ (/*@__PURE__*/ function () {
        function DebugNode(nativeNode, parent, _debugContext) {
            this._debugContext = _debugContext;
            this.nativeNode = nativeNode;
            if (parent && parent instanceof DebugElement) {
                parent.addChild(this);
            }
            else {
                this.parent = null;
            }
            this.listeners = [];
        }

        Object.defineProperty(DebugNode.prototype, "injector", {
            get: /**
             * @return {?}
             */ function () {
                return this._debugContext.injector;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DebugNode.prototype, "componentInstance", {
            get: /**
             * @return {?}
             */ function () {
                return this._debugContext.component;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DebugNode.prototype, "context", {
            get: /**
             * @return {?}
             */ function () {
                return this._debugContext.context;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DebugNode.prototype, "references", {
            get: /**
             * @return {?}
             */ function () {
                return this._debugContext.references;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DebugNode.prototype, "providerTokens", {
            get: /**
             * @return {?}
             */ function () {
                return this._debugContext.providerTokens;
            },
            enumerable: true,
            configurable: true
        });
        return DebugNode;
    }());
    /**
     * \@experimental All debugging apis are currently experimental.
     */
    var DebugElement = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
        __extends(DebugElement, _super);

        function DebugElement(nativeNode, parent, _debugContext) {
            var _this = _super.call(this, nativeNode, parent, _debugContext) || this;
            _this.properties = {};
            _this.attributes = {};
            _this.classes = {};
            _this.styles = {};
            _this.childNodes = [];
            _this.nativeElement = nativeNode;
            return _this;
        }

        /**
         * @param {?} child
         * @return {?}
         */
        DebugElement.prototype.addChild = /**
         * @param {?} child
         * @return {?}
         */
        function (child) {
            if (child) {
                this.childNodes.push(child);
                child.parent = this;
            }
        };
        /**
         * @param {?} child
         * @return {?}
         */
        DebugElement.prototype.removeChild = /**
         * @param {?} child
         * @return {?}
         */
        function (child) {
            var /** @type {?} */ childIndex = this.childNodes.indexOf(child);
            if (childIndex !== -1) {
                child.parent = null;
                this.childNodes.splice(childIndex, 1);
            }
        };
        /**
         * @param {?} child
         * @param {?} newChildren
         * @return {?}
         */
        DebugElement.prototype.insertChildrenAfter = /**
         * @param {?} child
         * @param {?} newChildren
         * @return {?}
         */
        function (child, newChildren) {
            var _this = this;
            var /** @type {?} */ siblingIndex = this.childNodes.indexOf(child);
            if (siblingIndex !== -1) {
                (_a = this.childNodes).splice.apply(_a, [siblingIndex + 1, 0].concat(newChildren));
                newChildren.forEach(function (c) {
                    if (c.parent) {
                        c.parent.removeChild(c);
                    }
                    c.parent = _this;
                });
            }
            var _a;
        };
        /**
         * @param {?} refChild
         * @param {?} newChild
         * @return {?}
         */
        DebugElement.prototype.insertBefore = /**
         * @param {?} refChild
         * @param {?} newChild
         * @return {?}
         */
        function (refChild, newChild) {
            var /** @type {?} */ refIndex = this.childNodes.indexOf(refChild);
            if (refIndex === -1) {
                this.addChild(newChild);
            }
            else {
                if (newChild.parent) {
                    newChild.parent.removeChild(newChild);
                }
                newChild.parent = this;
                this.childNodes.splice(refIndex, 0, newChild);
            }
        };
        /**
         * @param {?} predicate
         * @return {?}
         */
        DebugElement.prototype.query = /**
         * @param {?} predicate
         * @return {?}
         */
        function (predicate) {
            var /** @type {?} */ results = this.queryAll(predicate);
            return results[0] || null;
        };
        /**
         * @param {?} predicate
         * @return {?}
         */
        DebugElement.prototype.queryAll = /**
         * @param {?} predicate
         * @return {?}
         */
        function (predicate) {
            var /** @type {?} */ matches = [];
            _queryElementChildren(this, predicate, matches);
            return matches;
        };
        /**
         * @param {?} predicate
         * @return {?}
         */
        DebugElement.prototype.queryAllNodes = /**
         * @param {?} predicate
         * @return {?}
         */
        function (predicate) {
            var /** @type {?} */ matches = [];
            _queryNodeChildren(this, predicate, matches);
            return matches;
        };
        Object.defineProperty(DebugElement.prototype, "children", {
            get: /**
             * @return {?}
             */ function () {
                return /** @type {?} */ (this.childNodes.filter(function (node) {
                    return node instanceof DebugElement;
                }));
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @param {?} eventName
         * @param {?} eventObj
         * @return {?}
         */
        DebugElement.prototype.triggerEventHandler = /**
         * @param {?} eventName
         * @param {?} eventObj
         * @return {?}
         */
        function (eventName, eventObj) {
            this.listeners.forEach(function (listener) {
                if (listener.name == eventName) {
                    listener.callback(eventObj);
                }
            });
        };
        return DebugElement;
    }(DebugNode));

    /**
     * @param {?} element
     * @param {?} predicate
     * @param {?} matches
     * @return {?}
     */
    function _queryElementChildren(element, predicate, matches) {
        element.childNodes.forEach(function (node) {
            if (node instanceof DebugElement) {
                if (predicate(node)) {
                    matches.push(node);
                }
                _queryElementChildren(node, predicate, matches);
            }
        });
    }

    /**
     * @param {?} parentNode
     * @param {?} predicate
     * @param {?} matches
     * @return {?}
     */
    function _queryNodeChildren(parentNode, predicate, matches) {
        if (parentNode instanceof DebugElement) {
            parentNode.childNodes.forEach(function (node) {
                if (predicate(node)) {
                    matches.push(node);
                }
                if (node instanceof DebugElement) {
                    _queryNodeChildren(node, predicate, matches);
                }
            });
        }
    }

// Need to keep the nodes in a global Map so that multiple angular apps are supported.
    var _nativeNodeToDebugNode = /*@__PURE__*/ new Map();

    /**
     * \@experimental
     * @param {?} nativeNode
     * @return {?}
     */
    function getDebugNode(nativeNode) {
        return _nativeNodeToDebugNode.get(nativeNode) || null;
    }

    /**
     * @return {?}
     */
    /**
     * @param {?} node
     * @return {?}
     */
    function indexDebugNode(node) {
        _nativeNodeToDebugNode.set(node.nativeNode, node);
    }

    /**
     * @param {?} node
     * @return {?}
     */
    function removeDebugNodeFromIndex(node) {
        _nativeNodeToDebugNode.delete(node.nativeNode);
    }

    /**
     * A boolean-valued function over a value, possibly including context information
     * regarding that value's position in an array.
     *
     * \@experimental All debugging apis are currently experimental.
     * @record
     */
    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */

    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * @param {?} a
     * @param {?} b
     * @return {?}
     */
    function devModeEqual(a, b) {
        var /** @type {?} */ isListLikeIterableA = isListLikeIterable(a);
        var /** @type {?} */ isListLikeIterableB = isListLikeIterable(b);
        if (isListLikeIterableA && isListLikeIterableB) {
            return areIterablesEqual(a, b, devModeEqual);
        }
        else {
            var /** @type {?} */ isAObject = a && (typeof a === 'object' || typeof a === 'function');
            var /** @type {?} */ isBObject = b && (typeof b === 'object' || typeof b === 'function');
            if (!isListLikeIterableA && isAObject && !isListLikeIterableB && isBObject) {
                return true;
            }
            else {
                return looseIdentical(a, b);
            }
        }
    }

    /**
     * Indicates that the result of a {\@link Pipe} transformation has changed even though the
     * reference has not changed.
     *
     * Wrapped values are unwrapped automatically during the change detection, and the unwrapped value
     * is stored.
     *
     * Example:
     *
     * ```
     * if (this._latestValue === this._latestReturnedValue) {
     *    return this._latestReturnedValue;
     *  } else {
     *    this._latestReturnedValue = this._latestValue;
     *    return WrappedValue.wrap(this._latestValue); // this will force update
     *  }
     * ```
     * \@stable
     */
    var WrappedValue = /*@__PURE__*/ (/*@__PURE__*/ function () {
        function WrappedValue(value) {
            this.wrapped = value;
        }

        /** Creates a wrapped value. */
        /**
         * Creates a wrapped value.
         * @param {?} value
         * @return {?}
         */
        WrappedValue.wrap = /**
         * Creates a wrapped value.
         * @param {?} value
         * @return {?}
         */
        function (value) {
            return new WrappedValue(value);
        };
        /**
         * Returns the underlying value of a wrapped value.
         * Returns the given `value` when it is not wrapped.
         **/
        /**
         * Returns the underlying value of a wrapped value.
         * Returns the given `value` when it is not wrapped.
         *
         * @param {?} value
         * @return {?}
         */
        WrappedValue.unwrap = /**
         * Returns the underlying value of a wrapped value.
         * Returns the given `value` when it is not wrapped.
         *
         * @param {?} value
         * @return {?}
         */
        function (value) {
            return WrappedValue.isWrapped(value) ? value.wrapped : value;
        };
        /** Returns true if `value` is a wrapped value. */
        /**
         * Returns true if `value` is a wrapped value.
         * @param {?} value
         * @return {?}
         */
        WrappedValue.isWrapped = /**
         * Returns true if `value` is a wrapped value.
         * @param {?} value
         * @return {?}
         */
        function (value) {
            return value instanceof WrappedValue;
        };
        return WrappedValue;
    }());
    /**
     * Represents a basic change from a previous to a new value.
     * \@stable
     */
    var SimpleChange = /*@__PURE__*/ (/*@__PURE__*/ function () {
        function SimpleChange(previousValue, currentValue, firstChange) {
            this.previousValue = previousValue;
            this.currentValue = currentValue;
            this.firstChange = firstChange;
        }

        /**
         * Check whether the new value is the first value assigned.
         */
        /**
         * Check whether the new value is the first value assigned.
         * @return {?}
         */
        SimpleChange.prototype.isFirstChange = /**
         * Check whether the new value is the first value assigned.
         * @return {?}
         */
        function () {
            return this.firstChange;
        };
        return SimpleChange;
    }());

    /**
     * @param {?} obj
     * @return {?}
     */
    function isListLikeIterable(obj) {
        if (!isJsObject(obj))
            return false;
        return Array.isArray(obj) ||
            (!(obj instanceof Map) && // JS Map are iterables but return entries as [k, v]
                // JS Map are iterables but return entries as [k, v]
                getSymbolIterator() in obj); // JS Iterable have a Symbol.iterator prop
    }

    /**
     * @param {?} a
     * @param {?} b
     * @param {?} comparator
     * @return {?}
     */
    function areIterablesEqual(a, b, comparator) {
        var /** @type {?} */ iterator1 = a[getSymbolIterator()]();
        var /** @type {?} */ iterator2 = b[getSymbolIterator()]();
        while (true) {
            var /** @type {?} */ item1 = iterator1.next();
            var /** @type {?} */ item2 = iterator2.next();
            if (item1.done && item2.done)
                return true;
            if (item1.done || item2.done)
                return false;
            if (!comparator(item1.value, item2.value))
                return false;
        }
    }

    /**
     * @param {?} obj
     * @param {?} fn
     * @return {?}
     */
    function iterateListLike(obj, fn) {
        if (Array.isArray(obj)) {
            for (var /** @type {?} */ i = 0; i < obj.length; i++) {
                fn(obj[i]);
            }
        }
        else {
            var /** @type {?} */ iterator = obj[getSymbolIterator()]();
            var /** @type {?} */ item = void 0;
            while (!((item = iterator.next()).done)) {
                fn(item.value);
            }
        }
    }

    /**
     * @param {?} o
     * @return {?}
     */
    function isJsObject(o) {
        return o !== null && (typeof o === 'function' || typeof o === 'object');
    }

    var trackByIdentity = function (index, item) {
        return item;
    };
    /**
     * @deprecated v4.0.0 - Should not be part of public API.
     */
    var DefaultIterableDiffer = /*@__PURE__*/ (/*@__PURE__*/ function () {
        function DefaultIterableDiffer(trackByFn) {
            this.length = 0;
            this._linkedRecords = null;
            this._unlinkedRecords = null;
            this._previousItHead = null;
            this._itHead = null;
            this._itTail = null;
            this._additionsHead = null;
            this._additionsTail = null;
            this._movesHead = null;
            this._movesTail = null;
            this._removalsHead = null;
            this._removalsTail = null;
            this._identityChangesHead = null;
            this._identityChangesTail = null;
            this._trackByFn = trackByFn || trackByIdentity;
        }

        /**
         * @param {?} fn
         * @return {?}
         */
        DefaultIterableDiffer.prototype.forEachItem = /**
         * @param {?} fn
         * @return {?}
         */
        function (fn) {
            var /** @type {?} */ record;
            for (record = this._itHead; record !== null; record = record._next) {
                fn(record);
            }
        };
        /**
         * @param {?} fn
         * @return {?}
         */
        DefaultIterableDiffer.prototype.forEachOperation = /**
         * @param {?} fn
         * @return {?}
         */
        function (fn) {
            var /** @type {?} */ nextIt = this._itHead;
            var /** @type {?} */ nextRemove = this._removalsHead;
            var /** @type {?} */ addRemoveOffset = 0;
            var /** @type {?} */ moveOffsets = null;
            while (nextIt || nextRemove) {
                // Figure out which is the next record to process
                // Order: remove, add, move
                var /** @type {?} */ record = !nextRemove ||
                nextIt && /** @type {?} */ ((nextIt.currentIndex)) < getPreviousIndex(nextRemove, addRemoveOffset, moveOffsets) ? /** @type {?} */
                    ((nextIt)) :
                    nextRemove;
                var /** @type {?} */ adjPreviousIndex = getPreviousIndex(record, addRemoveOffset, moveOffsets);
                var /** @type {?} */ currentIndex = record.currentIndex;
                // consume the item, and adjust the addRemoveOffset and update moveDistance if necessary
                if (record === nextRemove) {
                    addRemoveOffset--;
                    nextRemove = nextRemove._nextRemoved;
                }
                else {
                    nextIt = /** @type {?} */ ((nextIt))._next;
                    if (record.previousIndex == null) {
                        addRemoveOffset++;
                    }
                    else {
                        // INVARIANT:  currentIndex < previousIndex
                        if (!moveOffsets)
                            moveOffsets = [];
                        var /** @type {?} */ localMovePreviousIndex = adjPreviousIndex - addRemoveOffset;
                        var /** @type {?} */ localCurrentIndex = ((currentIndex)) - addRemoveOffset;
                        if (localMovePreviousIndex != localCurrentIndex) {
                            for (var /** @type {?} */ i = 0; i < localMovePreviousIndex; i++) {
                                var /** @type {?} */ offset = i < moveOffsets.length ? moveOffsets[i] : (moveOffsets[i] = 0);
                                var /** @type {?} */ index = offset + i;
                                if (localCurrentIndex <= index && index < localMovePreviousIndex) {
                                    moveOffsets[i] = offset + 1;
                                }
                            }
                            var /** @type {?} */ previousIndex = record.previousIndex;
                            moveOffsets[previousIndex] = localCurrentIndex - localMovePreviousIndex;
                        }
                    }
                }
                if (adjPreviousIndex !== currentIndex) {
                    fn(record, adjPreviousIndex, currentIndex);
                }
            }
        };
        /**
         * @param {?} fn
         * @return {?}
         */
        DefaultIterableDiffer.prototype.forEachPreviousItem = /**
         * @param {?} fn
         * @return {?}
         */
        function (fn) {
            var /** @type {?} */ record;
            for (record = this._previousItHead; record !== null; record = record._nextPrevious) {
                fn(record);
            }
        };
        /**
         * @param {?} fn
         * @return {?}
         */
        DefaultIterableDiffer.prototype.forEachAddedItem = /**
         * @param {?} fn
         * @return {?}
         */
        function (fn) {
            var /** @type {?} */ record;
            for (record = this._additionsHead; record !== null; record = record._nextAdded) {
                fn(record);
            }
        };
        /**
         * @param {?} fn
         * @return {?}
         */
        DefaultIterableDiffer.prototype.forEachMovedItem = /**
         * @param {?} fn
         * @return {?}
         */
        function (fn) {
            var /** @type {?} */ record;
            for (record = this._movesHead; record !== null; record = record._nextMoved) {
                fn(record);
            }
        };
        /**
         * @param {?} fn
         * @return {?}
         */
        DefaultIterableDiffer.prototype.forEachRemovedItem = /**
         * @param {?} fn
         * @return {?}
         */
        function (fn) {
            var /** @type {?} */ record;
            for (record = this._removalsHead; record !== null; record = record._nextRemoved) {
                fn(record);
            }
        };
        /**
         * @param {?} fn
         * @return {?}
         */
        DefaultIterableDiffer.prototype.forEachIdentityChange = /**
         * @param {?} fn
         * @return {?}
         */
        function (fn) {
            var /** @type {?} */ record;
            for (record = this._identityChangesHead; record !== null; record = record._nextIdentityChange) {
                fn(record);
            }
        };
        /**
         * @param {?} collection
         * @return {?}
         */
        DefaultIterableDiffer.prototype.diff = /**
         * @param {?} collection
         * @return {?}
         */
        function (collection) {
            if (collection == null)
                collection = [];
            if (!isListLikeIterable(collection)) {
                throw new Error("Error trying to diff '" + stringify(collection) + "'. Only arrays and iterables are allowed");
            }
            if (this.check(collection)) {
                return this;
            }
            else {
                return null;
            }
        };
        /**
         * @return {?}
         */
        DefaultIterableDiffer.prototype.onDestroy = /**
         * @return {?}
         */
        function () {
        };
        /**
         * @param {?} collection
         * @return {?}
         */
        DefaultIterableDiffer.prototype.check = /**
         * @param {?} collection
         * @return {?}
         */
        function (collection) {
            var _this = this;
            this._reset();
            var /** @type {?} */ record = this._itHead;
            var /** @type {?} */ mayBeDirty = false;
            var /** @type {?} */ index;
            var /** @type {?} */ item;
            var /** @type {?} */ itemTrackBy;
            if (Array.isArray(collection)) {
                ((this)).length = collection.length;
                for (var /** @type {?} */ index_1 = 0; index_1 < this.length; index_1++) {
                    item = collection[index_1];
                    itemTrackBy = this._trackByFn(index_1, item);
                    if (record === null || !looseIdentical(record.trackById, itemTrackBy)) {
                        record = this._mismatch(record, item, itemTrackBy, index_1);
                        mayBeDirty = true;
                    }
                    else {
                        if (mayBeDirty) {
                            // TODO(misko): can we limit this to duplicates only?
                            record = this._verifyReinsertion(record, item, itemTrackBy, index_1);
                        }
                        if (!looseIdentical(record.item, item))
                            this._addIdentityChange(record, item);
                    }
                    record = record._next;
                }
            }
            else {
                index = 0;
                iterateListLike(collection, function (item) {
                    itemTrackBy = _this._trackByFn(index, item);
                    if (record === null || !looseIdentical(record.trackById, itemTrackBy)) {
                        record = _this._mismatch(record, item, itemTrackBy, index);
                        mayBeDirty = true;
                    }
                    else {
                        if (mayBeDirty) {
                            // TODO(misko): can we limit this to duplicates only?
                            record = _this._verifyReinsertion(record, item, itemTrackBy, index);
                        }
                        if (!looseIdentical(record.item, item))
                            _this._addIdentityChange(record, item);
                    }
                    record = record._next;
                    index++;
                });
                ((this)).length = index;
            }
            this._truncate(record);
            ((this)).collection = collection;
            return this.isDirty;
        };
        Object.defineProperty(DefaultIterableDiffer.prototype, "isDirty", {
            /* CollectionChanges is considered dirty if it has any additions, moves, removals, or identity
         * changes.
         */
            get: /**
             * @return {?}
             */ function () {
                return this._additionsHead !== null || this._movesHead !== null ||
                    this._removalsHead !== null || this._identityChangesHead !== null;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Reset the state of the change objects to show no changes. This means set previousKey to
         * currentKey, and clear all of the queues (additions, moves, removals).
         * Set the previousIndexes of moved and added items to their currentIndexes
         * Reset the list of additions, moves and removals
         *
         * @internal
         */
        /**
         * Reset the state of the change objects to show no changes. This means set previousKey to
         * currentKey, and clear all of the queues (additions, moves, removals).
         * Set the previousIndexes of moved and added items to their currentIndexes
         * Reset the list of additions, moves and removals
         *
         * \@internal
         * @return {?}
         */
        DefaultIterableDiffer.prototype._reset = /**
         * Reset the state of the change objects to show no changes. This means set previousKey to
         * currentKey, and clear all of the queues (additions, moves, removals).
         * Set the previousIndexes of moved and added items to their currentIndexes
         * Reset the list of additions, moves and removals
         *
         * \@internal
         * @return {?}
         */
        function () {
            if (this.isDirty) {
                var /** @type {?} */ record = void 0;
                var /** @type {?} */ nextRecord = void 0;
                for (record = this._previousItHead = this._itHead; record !== null; record = record._next) {
                    record._nextPrevious = record._next;
                }
                for (record = this._additionsHead; record !== null; record = record._nextAdded) {
                    record.previousIndex = record.currentIndex;
                }
                this._additionsHead = this._additionsTail = null;
                for (record = this._movesHead; record !== null; record = nextRecord) {
                    record.previousIndex = record.currentIndex;
                    nextRecord = record._nextMoved;
                }
                this._movesHead = this._movesTail = null;
                this._removalsHead = this._removalsTail = null;
                this._identityChangesHead = this._identityChangesTail = null;
                // todo(vicb) when assert gets supported
                // assert(!this.isDirty);
            }
        };
        /**
         * This is the core function which handles differences between collections.
         *
         * - `record` is the record which we saw at this position last time. If null then it is a new
         *   item.
         * - `item` is the current item in the collection
         * - `index` is the position of the item in the collection
         *
         * @internal
         */
        /**
         * This is the core function which handles differences between collections.
         *
         * - `record` is the record which we saw at this position last time. If null then it is a new
         *   item.
         * - `item` is the current item in the collection
         * - `index` is the position of the item in the collection
         *
         * \@internal
         * @param {?} record
         * @param {?} item
         * @param {?} itemTrackBy
         * @param {?} index
         * @return {?}
         */
        DefaultIterableDiffer.prototype._mismatch = /**
         * This is the core function which handles differences between collections.
         *
         * - `record` is the record which we saw at this position last time. If null then it is a new
         *   item.
         * - `item` is the current item in the collection
         * - `index` is the position of the item in the collection
         *
         * \@internal
         * @param {?} record
         * @param {?} item
         * @param {?} itemTrackBy
         * @param {?} index
         * @return {?}
         */
        function (record, item, itemTrackBy, index) {
            // The previous record after which we will append the current one.
            var /** @type {?} */ previousRecord;
            if (record === null) {
                previousRecord = this._itTail;
            }
            else {
                previousRecord = record._prev;
                // Remove the record from the collection since we know it does not match the item.
                this._remove(record);
            }
            // Attempt to see if we have seen the item before.
            record = this._linkedRecords === null ? null : this._linkedRecords.get(itemTrackBy, index);
            if (record !== null) {
                // We have seen this before, we need to move it forward in the collection.
                // But first we need to check if identity changed, so we can update in view if necessary
                if (!looseIdentical(record.item, item))
                    this._addIdentityChange(record, item);
                this._moveAfter(record, previousRecord, index);
            }
            else {
                // Never seen it, check evicted list.
                record = this._unlinkedRecords === null ? null : this._unlinkedRecords.get(itemTrackBy, null);
                if (record !== null) {
                    // It is an item which we have evicted earlier: reinsert it back into the list.
                    // But first we need to check if identity changed, so we can update in view if necessary
                    if (!looseIdentical(record.item, item))
                        this._addIdentityChange(record, item);
                    this._reinsertAfter(record, previousRecord, index);
                }
                else {
                    // It is a new item: add it.
                    record =
                        this._addAfter(new IterableChangeRecord_(item, itemTrackBy), previousRecord, index);
                }
            }
            return record;
        };
        /**
         * This check is only needed if an array contains duplicates. (Short circuit of nothing dirty)
         *
         * Use case: `[a, a]` => `[b, a, a]`
         *
         * If we did not have this check then the insertion of `b` would:
         *   1) evict first `a`
         *   2) insert `b` at `0` index.
         *   3) leave `a` at index `1` as is. <-- this is wrong!
         *   3) reinsert `a` at index 2. <-- this is wrong!
         *
         * The correct behavior is:
         *   1) evict first `a`
         *   2) insert `b` at `0` index.
         *   3) reinsert `a` at index 1.
         *   3) move `a` at from `1` to `2`.
         *
         *
         * Double check that we have not evicted a duplicate item. We need to check if the item type may
         * have already been removed:
         * The insertion of b will evict the first 'a'. If we don't reinsert it now it will be reinserted
         * at the end. Which will show up as the two 'a's switching position. This is incorrect, since a
         * better way to think of it is as insert of 'b' rather then switch 'a' with 'b' and then add 'a'
         * at the end.
         *
         * @internal
         */
        /**
         * This check is only needed if an array contains duplicates. (Short circuit of nothing dirty)
         *
         * Use case: `[a, a]` => `[b, a, a]`
         *
         * If we did not have this check then the insertion of `b` would:
         *   1) evict first `a`
         *   2) insert `b` at `0` index.
         *   3) leave `a` at index `1` as is. <-- this is wrong!
         *   3) reinsert `a` at index 2. <-- this is wrong!
         *
         * The correct behavior is:
         *   1) evict first `a`
         *   2) insert `b` at `0` index.
         *   3) reinsert `a` at index 1.
         *   3) move `a` at from `1` to `2`.
         *
         *
         * Double check that we have not evicted a duplicate item. We need to check if the item type may
         * have already been removed:
         * The insertion of b will evict the first 'a'. If we don't reinsert it now it will be reinserted
         * at the end. Which will show up as the two 'a's switching position. This is incorrect, since a
         * better way to think of it is as insert of 'b' rather then switch 'a' with 'b' and then add 'a'
         * at the end.
         *
         * \@internal
         * @param {?} record
         * @param {?} item
         * @param {?} itemTrackBy
         * @param {?} index
         * @return {?}
         */
        DefaultIterableDiffer.prototype._verifyReinsertion = /**
         * This check is only needed if an array contains duplicates. (Short circuit of nothing dirty)
         *
         * Use case: `[a, a]` => `[b, a, a]`
         *
         * If we did not have this check then the insertion of `b` would:
         *   1) evict first `a`
         *   2) insert `b` at `0` index.
         *   3) leave `a` at index `1` as is. <-- this is wrong!
         *   3) reinsert `a` at index 2. <-- this is wrong!
         *
         * The correct behavior is:
         *   1) evict first `a`
         *   2) insert `b` at `0` index.
         *   3) reinsert `a` at index 1.
         *   3) move `a` at from `1` to `2`.
         *
         *
         * Double check that we have not evicted a duplicate item. We need to check if the item type may
         * have already been removed:
         * The insertion of b will evict the first 'a'. If we don't reinsert it now it will be reinserted
         * at the end. Which will show up as the two 'a's switching position. This is incorrect, since a
         * better way to think of it is as insert of 'b' rather then switch 'a' with 'b' and then add 'a'
         * at the end.
         *
         * \@internal
         * @param {?} record
         * @param {?} item
         * @param {?} itemTrackBy
         * @param {?} index
         * @return {?}
         */
        function (record, item, itemTrackBy, index) {
            var /** @type {?} */ reinsertRecord = this._unlinkedRecords === null ? null : this._unlinkedRecords.get(itemTrackBy, null);
            if (reinsertRecord !== null) {
                record = this._reinsertAfter(reinsertRecord, /** @type {?} */ ((record._prev)), index);
            }
            else if (record.currentIndex != index) {
                record.currentIndex = index;
                this._addToMoves(record, index);
            }
            return record;
        };
        /**
         * Get rid of any excess {@link IterableChangeRecord_}s from the previous collection
         *
         * - `record` The first excess {@link IterableChangeRecord_}.
         *
         * @internal
         */
        /**
         * Get rid of any excess {\@link IterableChangeRecord_}s from the previous collection
         *
         * - `record` The first excess {\@link IterableChangeRecord_}.
         *
         * \@internal
         * @param {?} record
         * @return {?}
         */
        DefaultIterableDiffer.prototype._truncate = /**
         * Get rid of any excess {\@link IterableChangeRecord_}s from the previous collection
         *
         * - `record` The first excess {\@link IterableChangeRecord_}.
         *
         * \@internal
         * @param {?} record
         * @return {?}
         */
        function (record) {
            // Anything after that needs to be removed;
            while (record !== null) {
                var /** @type {?} */ nextRecord = record._next;
                this._addToRemovals(this._unlink(record));
                record = nextRecord;
            }
            if (this._unlinkedRecords !== null) {
                this._unlinkedRecords.clear();
            }
            if (this._additionsTail !== null) {
                this._additionsTail._nextAdded = null;
            }
            if (this._movesTail !== null) {
                this._movesTail._nextMoved = null;
            }
            if (this._itTail !== null) {
                this._itTail._next = null;
            }
            if (this._removalsTail !== null) {
                this._removalsTail._nextRemoved = null;
            }
            if (this._identityChangesTail !== null) {
                this._identityChangesTail._nextIdentityChange = null;
            }
        };
        /** @internal */
        /**
         * \@internal
         * @param {?} record
         * @param {?} prevRecord
         * @param {?} index
         * @return {?}
         */
        DefaultIterableDiffer.prototype._reinsertAfter = /**
         * \@internal
         * @param {?} record
         * @param {?} prevRecord
         * @param {?} index
         * @return {?}
         */
        function (record, prevRecord, index) {
            if (this._unlinkedRecords !== null) {
                this._unlinkedRecords.remove(record);
            }
            var /** @type {?} */ prev = record._prevRemoved;
            var /** @type {?} */ next = record._nextRemoved;
            if (prev === null) {
                this._removalsHead = next;
            }
            else {
                prev._nextRemoved = next;
            }
            if (next === null) {
                this._removalsTail = prev;
            }
            else {
                next._prevRemoved = prev;
            }
            this._insertAfter(record, prevRecord, index);
            this._addToMoves(record, index);
            return record;
        };
        /** @internal */
        /**
         * \@internal
         * @param {?} record
         * @param {?} prevRecord
         * @param {?} index
         * @return {?}
         */
        DefaultIterableDiffer.prototype._moveAfter = /**
         * \@internal
         * @param {?} record
         * @param {?} prevRecord
         * @param {?} index
         * @return {?}
         */
        function (record, prevRecord, index) {
            this._unlink(record);
            this._insertAfter(record, prevRecord, index);
            this._addToMoves(record, index);
            return record;
        };
        /** @internal */
        /**
         * \@internal
         * @param {?} record
         * @param {?} prevRecord
         * @param {?} index
         * @return {?}
         */
        DefaultIterableDiffer.prototype._addAfter = /**
         * \@internal
         * @param {?} record
         * @param {?} prevRecord
         * @param {?} index
         * @return {?}
         */
        function (record, prevRecord, index) {
            this._insertAfter(record, prevRecord, index);
            if (this._additionsTail === null) {
                // todo(vicb)
                // assert(this._additionsHead === null);
                this._additionsTail = this._additionsHead = record;
            }
            else {
                // todo(vicb)
                // assert(_additionsTail._nextAdded === null);
                // assert(record._nextAdded === null);
                this._additionsTail = this._additionsTail._nextAdded = record;
            }
            return record;
        };
        /** @internal */
        /**
         * \@internal
         * @param {?} record
         * @param {?} prevRecord
         * @param {?} index
         * @return {?}
         */
        DefaultIterableDiffer.prototype._insertAfter = /**
         * \@internal
         * @param {?} record
         * @param {?} prevRecord
         * @param {?} index
         * @return {?}
         */
        function (record, prevRecord, index) {
            // todo(vicb)
            // assert(record != prevRecord);
            // assert(record._next === null);
            // assert(record._prev === null);
            var /** @type {?} */ next = prevRecord === null ? this._itHead : prevRecord._next;
            // todo(vicb)
            // assert(next != record);
            // assert(prevRecord != record);
            record._next = next;
            record._prev = prevRecord;
            if (next === null) {
                this._itTail = record;
            }
            else {
                next._prev = record;
            }
            if (prevRecord === null) {
                this._itHead = record;
            }
            else {
                prevRecord._next = record;
            }
            if (this._linkedRecords === null) {
                this._linkedRecords = new _DuplicateMap();
            }
            this._linkedRecords.put(record);
            record.currentIndex = index;
            return record;
        };
        /** @internal */
        /**
         * \@internal
         * @param {?} record
         * @return {?}
         */
        DefaultIterableDiffer.prototype._remove = /**
         * \@internal
         * @param {?} record
         * @return {?}
         */
        function (record) {
            return this._addToRemovals(this._unlink(record));
        };
        /** @internal */
        /**
         * \@internal
         * @param {?} record
         * @return {?}
         */
        DefaultIterableDiffer.prototype._unlink = /**
         * \@internal
         * @param {?} record
         * @return {?}
         */
        function (record) {
            if (this._linkedRecords !== null) {
                this._linkedRecords.remove(record);
            }
            var /** @type {?} */ prev = record._prev;
            var /** @type {?} */ next = record._next;
            // todo(vicb)
            // assert((record._prev = null) === null);
            // assert((record._next = null) === null);
            if (prev === null) {
                this._itHead = next;
            }
            else {
                prev._next = next;
            }
            if (next === null) {
                this._itTail = prev;
            }
            else {
                next._prev = prev;
            }
            return record;
        };
        /** @internal */
        /**
         * \@internal
         * @param {?} record
         * @param {?} toIndex
         * @return {?}
         */
        DefaultIterableDiffer.prototype._addToMoves = /**
         * \@internal
         * @param {?} record
         * @param {?} toIndex
         * @return {?}
         */
        function (record, toIndex) {
            // todo(vicb)
            // assert(record._nextMoved === null);
            if (record.previousIndex === toIndex) {
                return record;
            }
            if (this._movesTail === null) {
                // todo(vicb)
                // assert(_movesHead === null);
                this._movesTail = this._movesHead = record;
            }
            else {
                // todo(vicb)
                // assert(_movesTail._nextMoved === null);
                this._movesTail = this._movesTail._nextMoved = record;
            }
            return record;
        };
        /**
         * @param {?} record
         * @return {?}
         */
        DefaultIterableDiffer.prototype._addToRemovals = /**
         * @param {?} record
         * @return {?}
         */
        function (record) {
            if (this._unlinkedRecords === null) {
                this._unlinkedRecords = new _DuplicateMap();
            }
            this._unlinkedRecords.put(record);
            record.currentIndex = null;
            record._nextRemoved = null;
            if (this._removalsTail === null) {
                // todo(vicb)
                // assert(_removalsHead === null);
                this._removalsTail = this._removalsHead = record;
                record._prevRemoved = null;
            }
            else {
                // todo(vicb)
                // assert(_removalsTail._nextRemoved === null);
                // assert(record._nextRemoved === null);
                record._prevRemoved = this._removalsTail;
                this._removalsTail = this._removalsTail._nextRemoved = record;
            }
            return record;
        };
        /** @internal */
        /**
         * \@internal
         * @param {?} record
         * @param {?} item
         * @return {?}
         */
        DefaultIterableDiffer.prototype._addIdentityChange = /**
         * \@internal
         * @param {?} record
         * @param {?} item
         * @return {?}
         */
        function (record, item) {
            record.item = item;
            if (this._identityChangesTail === null) {
                this._identityChangesTail = this._identityChangesHead = record;
            }
            else {
                this._identityChangesTail = this._identityChangesTail._nextIdentityChange = record;
            }
            return record;
        };
        return DefaultIterableDiffer;
    }());
    /**
     * \@stable
     */
    var IterableChangeRecord_ = /*@__PURE__*/ (/*@__PURE__*/ function () {
        function IterableChangeRecord_(item, trackById) {
            this.item = item;
            this.trackById = trackById;
            this.currentIndex = null;
            this.previousIndex = null;
            /**
             * \@internal
             */
            this._nextPrevious = null;
            /**
             * \@internal
             */
            this._prev = null;
            /**
             * \@internal
             */
            this._next = null;
            /**
             * \@internal
             */
            this._prevDup = null;
            /**
             * \@internal
             */
            this._nextDup = null;
            /**
             * \@internal
             */
            this._prevRemoved = null;
            /**
             * \@internal
             */
            this._nextRemoved = null;
            /**
             * \@internal
             */
            this._nextAdded = null;
            /**
             * \@internal
             */
            this._nextMoved = null;
            /**
             * \@internal
             */
            this._nextIdentityChange = null;
        }

        return IterableChangeRecord_;
    }());
    var _DuplicateItemRecordList = /*@__PURE__*/ (/*@__PURE__*/ function () {
        function _DuplicateItemRecordList() {
            /**
             * \@internal
             */
            this._head = null;
            /**
             * \@internal
             */
            this._tail = null;
        }

        /**
         * Append the record to the list of duplicates.
         *
         * Note: by design all records in the list of duplicates hold the same value in record.item.
         */
        /**
         * Append the record to the list of duplicates.
         *
         * Note: by design all records in the list of duplicates hold the same value in record.item.
         * @param {?} record
         * @return {?}
         */
        _DuplicateItemRecordList.prototype.add = /**
         * Append the record to the list of duplicates.
         *
         * Note: by design all records in the list of duplicates hold the same value in record.item.
         * @param {?} record
         * @return {?}
         */
        function (record) {
            if (this._head === null) {
                this._head = this._tail = record;
                record._nextDup = null;
                record._prevDup = null;
            }
            else {
                /** @type {?} */ ((
                    // todo(vicb)
                    // assert(record.item ==  _head.item ||
                    //       record.item is num && record.item.isNaN && _head.item is num && _head.item.isNaN);
                    this._tail))._nextDup = record;
                record._prevDup = this._tail;
                record._nextDup = null;
                this._tail = record;
            }
        };
        // Returns a IterableChangeRecord_ having IterableChangeRecord_.trackById == trackById and
        // IterableChangeRecord_.currentIndex >= atOrAfterIndex
        /**
         * @param {?} trackById
         * @param {?} atOrAfterIndex
         * @return {?}
         */
        _DuplicateItemRecordList.prototype.get = /**
         * @param {?} trackById
         * @param {?} atOrAfterIndex
         * @return {?}
         */
        function (trackById, atOrAfterIndex) {
            var /** @type {?} */ record;
            for (record = this._head; record !== null; record = record._nextDup) {
                if ((atOrAfterIndex === null || atOrAfterIndex <= /** @type {?} */ ((record.currentIndex))) &&
                    looseIdentical(record.trackById, trackById)) {
                    return record;
                }
            }
            return null;
        };
        /**
         * Remove one {@link IterableChangeRecord_} from the list of duplicates.
         *
         * Returns whether the list of duplicates is empty.
         */
        /**
         * Remove one {\@link IterableChangeRecord_} from the list of duplicates.
         *
         * Returns whether the list of duplicates is empty.
         * @param {?} record
         * @return {?}
         */
        _DuplicateItemRecordList.prototype.remove = /**
         * Remove one {\@link IterableChangeRecord_} from the list of duplicates.
         *
         * Returns whether the list of duplicates is empty.
         * @param {?} record
         * @return {?}
         */
        function (record) {
            // todo(vicb)
            // assert(() {
            //  // verify that the record being removed is in the list.
            //  for (IterableChangeRecord_ cursor = _head; cursor != null; cursor = cursor._nextDup) {
            //    if (identical(cursor, record)) return true;
            //  }
            //  return false;
            //});
            var /** @type {?} */ prev = record._prevDup;
            var /** @type {?} */ next = record._nextDup;
            if (prev === null) {
                this._head = next;
            }
            else {
                prev._nextDup = next;
            }
            if (next === null) {
                this._tail = prev;
            }
            else {
                next._prevDup = prev;
            }
            return this._head === null;
        };
        return _DuplicateItemRecordList;
    }());
    var _DuplicateMap = /*@__PURE__*/ (/*@__PURE__*/ function () {
        function _DuplicateMap() {
            this.map = new Map();
        }

        /**
         * @param {?} record
         * @return {?}
         */
        _DuplicateMap.prototype.put = /**
         * @param {?} record
         * @return {?}
         */
        function (record) {
            var /** @type {?} */ key = record.trackById;
            var /** @type {?} */ duplicates = this.map.get(key);
            if (!duplicates) {
                duplicates = new _DuplicateItemRecordList();
                this.map.set(key, duplicates);
            }
            duplicates.add(record);
        };
        /**
         * Retrieve the `value` using key. Because the IterableChangeRecord_ value may be one which we
         * have already iterated over, we use the `atOrAfterIndex` to pretend it is not there.
         *
         * Use case: `[a, b, c, a, a]` if we are at index `3` which is the second `a` then asking if we
         * have any more `a`s needs to return the second `a`.
         */
        /**
         * Retrieve the `value` using key. Because the IterableChangeRecord_ value may be one which we
         * have already iterated over, we use the `atOrAfterIndex` to pretend it is not there.
         *
         * Use case: `[a, b, c, a, a]` if we are at index `3` which is the second `a` then asking if we
         * have any more `a`s needs to return the second `a`.
         * @param {?} trackById
         * @param {?} atOrAfterIndex
         * @return {?}
         */
        _DuplicateMap.prototype.get = /**
         * Retrieve the `value` using key. Because the IterableChangeRecord_ value may be one which we
         * have already iterated over, we use the `atOrAfterIndex` to pretend it is not there.
         *
         * Use case: `[a, b, c, a, a]` if we are at index `3` which is the second `a` then asking if we
         * have any more `a`s needs to return the second `a`.
         * @param {?} trackById
         * @param {?} atOrAfterIndex
         * @return {?}
         */
        function (trackById, atOrAfterIndex) {
            var /** @type {?} */ key = trackById;
            var /** @type {?} */ recordList = this.map.get(key);
            return recordList ? recordList.get(trackById, atOrAfterIndex) : null;
        };
        /**
         * Removes a {@link IterableChangeRecord_} from the list of duplicates.
         *
         * The list of duplicates also is removed from the map if it gets empty.
         */
        /**
         * Removes a {\@link IterableChangeRecord_} from the list of duplicates.
         *
         * The list of duplicates also is removed from the map if it gets empty.
         * @param {?} record
         * @return {?}
         */
        _DuplicateMap.prototype.remove = /**
         * Removes a {\@link IterableChangeRecord_} from the list of duplicates.
         *
         * The list of duplicates also is removed from the map if it gets empty.
         * @param {?} record
         * @return {?}
         */
        function (record) {
            var /** @type {?} */ key = record.trackById;
            var /** @type {?} */ recordList = ((this.map.get(key)));
            // Remove the list of duplicates when it gets empty
            if (recordList.remove(record)) {
                this.map.delete(key);
            }
            return record;
        };
        Object.defineProperty(_DuplicateMap.prototype, "isEmpty", {
            get: /**
             * @return {?}
             */ function () {
                return this.map.size === 0;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @return {?}
         */
        _DuplicateMap.prototype.clear = /**
         * @return {?}
         */
        function () {
            this.map.clear();
        };
        return _DuplicateMap;
    }());

    /**
     * @param {?} item
     * @param {?} addRemoveOffset
     * @param {?} moveOffsets
     * @return {?}
     */
    function getPreviousIndex(item, addRemoveOffset, moveOffsets) {
        var /** @type {?} */ previousIndex = item.previousIndex;
        if (previousIndex === null)
            return previousIndex;
        var /** @type {?} */ moveOffset = 0;
        if (moveOffsets && previousIndex < moveOffsets.length) {
            moveOffset = moveOffsets[previousIndex];
        }
        return previousIndex + addRemoveOffset + moveOffset;
    }

    var DefaultKeyValueDiffer = /*@__PURE__*/ (/*@__PURE__*/ function () {
        function DefaultKeyValueDiffer() {
            this._records = new Map();
            this._mapHead = null;
            this._appendAfter = null;
            this._previousMapHead = null;
            this._changesHead = null;
            this._changesTail = null;
            this._additionsHead = null;
            this._additionsTail = null;
            this._removalsHead = null;
            this._removalsTail = null;
        }

        Object.defineProperty(DefaultKeyValueDiffer.prototype, "isDirty", {
            get: /**
             * @return {?}
             */ function () {
                return this._additionsHead !== null || this._changesHead !== null ||
                    this._removalsHead !== null;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @param {?} fn
         * @return {?}
         */
        DefaultKeyValueDiffer.prototype.forEachItem = /**
         * @param {?} fn
         * @return {?}
         */
        function (fn) {
            var /** @type {?} */ record;
            for (record = this._mapHead; record !== null; record = record._next) {
                fn(record);
            }
        };
        /**
         * @param {?} fn
         * @return {?}
         */
        DefaultKeyValueDiffer.prototype.forEachPreviousItem = /**
         * @param {?} fn
         * @return {?}
         */
        function (fn) {
            var /** @type {?} */ record;
            for (record = this._previousMapHead; record !== null; record = record._nextPrevious) {
                fn(record);
            }
        };
        /**
         * @param {?} fn
         * @return {?}
         */
        DefaultKeyValueDiffer.prototype.forEachChangedItem = /**
         * @param {?} fn
         * @return {?}
         */
        function (fn) {
            var /** @type {?} */ record;
            for (record = this._changesHead; record !== null; record = record._nextChanged) {
                fn(record);
            }
        };
        /**
         * @param {?} fn
         * @return {?}
         */
        DefaultKeyValueDiffer.prototype.forEachAddedItem = /**
         * @param {?} fn
         * @return {?}
         */
        function (fn) {
            var /** @type {?} */ record;
            for (record = this._additionsHead; record !== null; record = record._nextAdded) {
                fn(record);
            }
        };
        /**
         * @param {?} fn
         * @return {?}
         */
        DefaultKeyValueDiffer.prototype.forEachRemovedItem = /**
         * @param {?} fn
         * @return {?}
         */
        function (fn) {
            var /** @type {?} */ record;
            for (record = this._removalsHead; record !== null; record = record._nextRemoved) {
                fn(record);
            }
        };
        /**
         * @param {?=} map
         * @return {?}
         */
        DefaultKeyValueDiffer.prototype.diff = /**
         * @param {?=} map
         * @return {?}
         */
        function (map) {
            if (!map) {
                map = new Map();
            }
            else if (!(map instanceof Map || isJsObject(map))) {
                throw new Error("Error trying to diff '" + stringify(map) + "'. Only maps and objects are allowed");
            }
            return this.check(map) ? this : null;
        };
        /**
         * @return {?}
         */
        DefaultKeyValueDiffer.prototype.onDestroy = /**
         * @return {?}
         */
        function () {
        };
        /**
         * Check the current state of the map vs the previous.
         * The algorithm is optimised for when the keys do no change.
         */
        /**
         * Check the current state of the map vs the previous.
         * The algorithm is optimised for when the keys do no change.
         * @param {?} map
         * @return {?}
         */
        DefaultKeyValueDiffer.prototype.check = /**
         * Check the current state of the map vs the previous.
         * The algorithm is optimised for when the keys do no change.
         * @param {?} map
         * @return {?}
         */
        function (map) {
            var _this = this;
            this._reset();
            var /** @type {?} */ insertBefore = this._mapHead;
            this._appendAfter = null;
            this._forEach(map, function (value, key) {
                if (insertBefore && insertBefore.key === key) {
                    _this._maybeAddToChanges(insertBefore, value);
                    _this._appendAfter = insertBefore;
                    insertBefore = insertBefore._next;
                }
                else {
                    var /** @type {?} */ record = _this._getOrCreateRecordForKey(key, value);
                    insertBefore = _this._insertBeforeOrAppend(insertBefore, record);
                }
            });
            // Items remaining at the end of the list have been deleted
            if (insertBefore) {
                if (insertBefore._prev) {
                    insertBefore._prev._next = null;
                }
                this._removalsHead = insertBefore;
                for (var /** @type {?} */ record = insertBefore; record !== null; record = record._nextRemoved) {
                    if (record === this._mapHead) {
                        this._mapHead = null;
                    }
                    this._records.delete(record.key);
                    record._nextRemoved = record._next;
                    record.previousValue = record.currentValue;
                    record.currentValue = null;
                    record._prev = null;
                    record._next = null;
                }
            }
            // Make sure tails have no next records from previous runs
            if (this._changesTail)
                this._changesTail._nextChanged = null;
            if (this._additionsTail)
                this._additionsTail._nextAdded = null;
            return this.isDirty;
        };
        /**
         * Inserts a record before `before` or append at the end of the list when `before` is null.
         *
         * Notes:
         * - This method appends at `this._appendAfter`,
         * - This method updates `this._appendAfter`,
         * - The return value is the new value for the insertion pointer.
         * @param {?} before
         * @param {?} record
         * @return {?}
         */
        DefaultKeyValueDiffer.prototype._insertBeforeOrAppend = /**
         * Inserts a record before `before` or append at the end of the list when `before` is null.
         *
         * Notes:
         * - This method appends at `this._appendAfter`,
         * - This method updates `this._appendAfter`,
         * - The return value is the new value for the insertion pointer.
         * @param {?} before
         * @param {?} record
         * @return {?}
         */
        function (before, record) {
            if (before) {
                var /** @type {?} */ prev = before._prev;
                record._next = before;
                record._prev = prev;
                before._prev = record;
                if (prev) {
                    prev._next = record;
                }
                if (before === this._mapHead) {
                    this._mapHead = record;
                }
                this._appendAfter = before;
                return before;
            }
            if (this._appendAfter) {
                this._appendAfter._next = record;
                record._prev = this._appendAfter;
            }
            else {
                this._mapHead = record;
            }
            this._appendAfter = record;
            return null;
        };
        /**
         * @param {?} key
         * @param {?} value
         * @return {?}
         */
        DefaultKeyValueDiffer.prototype._getOrCreateRecordForKey = /**
         * @param {?} key
         * @param {?} value
         * @return {?}
         */
        function (key, value) {
            if (this._records.has(key)) {
                var /** @type {?} */ record_1 = ((this._records.get(key)));
                this._maybeAddToChanges(record_1, value);
                var /** @type {?} */ prev = record_1._prev;
                var /** @type {?} */ next = record_1._next;
                if (prev) {
                    prev._next = next;
                }
                if (next) {
                    next._prev = prev;
                }
                record_1._next = null;
                record_1._prev = null;
                return record_1;
            }
            var /** @type {?} */ record = new KeyValueChangeRecord_(key);
            this._records.set(key, record);
            record.currentValue = value;
            this._addToAdditions(record);
            return record;
        };
        /** @internal */
        /**
         * \@internal
         * @return {?}
         */
        DefaultKeyValueDiffer.prototype._reset = /**
         * \@internal
         * @return {?}
         */
        function () {
            if (this.isDirty) {
                var /** @type {?} */ record = void 0;
                // let `_previousMapHead` contain the state of the map before the changes
                this._previousMapHead = this._mapHead;
                for (record = this._previousMapHead; record !== null; record = record._next) {
                    record._nextPrevious = record._next;
                }
                // Update `record.previousValue` with the value of the item before the changes
                // We need to update all changed items (that's those which have been added and changed)
                for (record = this._changesHead; record !== null; record = record._nextChanged) {
                    record.previousValue = record.currentValue;
                }
                for (record = this._additionsHead; record != null; record = record._nextAdded) {
                    record.previousValue = record.currentValue;
                }
                this._changesHead = this._changesTail = null;
                this._additionsHead = this._additionsTail = null;
                this._removalsHead = null;
            }
        };
        /**
         * @param {?} record
         * @param {?} newValue
         * @return {?}
         */
        DefaultKeyValueDiffer.prototype._maybeAddToChanges = /**
         * @param {?} record
         * @param {?} newValue
         * @return {?}
         */
        function (record, newValue) {
            if (!looseIdentical(newValue, record.currentValue)) {
                record.previousValue = record.currentValue;
                record.currentValue = newValue;
                this._addToChanges(record);
            }
        };
        /**
         * @param {?} record
         * @return {?}
         */
        DefaultKeyValueDiffer.prototype._addToAdditions = /**
         * @param {?} record
         * @return {?}
         */
        function (record) {
            if (this._additionsHead === null) {
                this._additionsHead = this._additionsTail = record;
            }
            else {
                /** @type {?} */ ((this._additionsTail))._nextAdded = record;
                this._additionsTail = record;
            }
        };
        /**
         * @param {?} record
         * @return {?}
         */
        DefaultKeyValueDiffer.prototype._addToChanges = /**
         * @param {?} record
         * @return {?}
         */
        function (record) {
            if (this._changesHead === null) {
                this._changesHead = this._changesTail = record;
            }
            else {
                /** @type {?} */ ((this._changesTail))._nextChanged = record;
                this._changesTail = record;
            }
        };
        /**
         * \@internal
         * @template K, V
         * @param {?} obj
         * @param {?} fn
         * @return {?}
         */
        DefaultKeyValueDiffer.prototype._forEach = /**
         * \@internal
         * @template K, V
         * @param {?} obj
         * @param {?} fn
         * @return {?}
         */
        function (obj, fn) {
            if (obj instanceof Map) {
                obj.forEach(fn);
            }
            else {
                Object.keys(obj).forEach(function (k) {
                    return fn(obj[k], k);
                });
            }
        };
        return DefaultKeyValueDiffer;
    }());
    /**
     * \@stable
     */
    var KeyValueChangeRecord_ = /*@__PURE__*/ (/*@__PURE__*/ function () {
        function KeyValueChangeRecord_(key) {
            this.key = key;
            this.previousValue = null;
            this.currentValue = null;
            /**
             * \@internal
             */
            this._nextPrevious = null;
            /**
             * \@internal
             */
            this._next = null;
            /**
             * \@internal
             */
            this._prev = null;
            /**
             * \@internal
             */
            this._nextAdded = null;
            /**
             * \@internal
             */
            this._nextRemoved = null;
            /**
             * \@internal
             */
            this._nextChanged = null;
        }

        return KeyValueChangeRecord_;
    }());
    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /** @enum {number} */
    var SecurityContext = /*@__PURE__*/ (function () {
        var SecurityContext = {
            NONE: 0,
            HTML: 1,
            STYLE: 2,
            SCRIPT: 3,
            URL: 4,
            RESOURCE_URL: 5,
        };
        SecurityContext[SecurityContext.NONE] = "NONE";
        SecurityContext[SecurityContext.HTML] = "HTML";
        SecurityContext[SecurityContext.STYLE] = "STYLE";
        SecurityContext[SecurityContext.SCRIPT] = "SCRIPT";
        SecurityContext[SecurityContext.URL] = "URL";
        SecurityContext[SecurityContext.RESOURCE_URL] = "RESOURCE_URL";
        return SecurityContext;
    })();
    /**
     * Sanitizer is used by the views to sanitize potentially dangerous values.
     *
     * \@stable
     * @abstract
     */
    var Sanitizer = /*@__PURE__*/ (/*@__PURE__*/ function () {
        function Sanitizer() {
        }

        return Sanitizer;
    }());
    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * Factory for ViewDefinitions/NgModuleDefinitions.
     * We use a function so we can reexeute it in case an error happens and use the given logger
     * function to log the error from the definition of the node, which is shown in all browser
     * logs.
     * @record
     */
    /**
     * Function to call console.error at the right source location. This is an indirection
     * via another function as browser will log the location that actually called
     * `console.error`.
     * @record
     */
    /**
     * @record
     */
    /**
     * @record
     */
    /**
     * @record
     */
    /**
     * @record
     */
    /**
     * @record
     */
    /**
     * @record
     */
    /**
     * @record
     */
    /**
     * @record
     */
    /**
     * A node definition in the view.
     *
     * Note: We use one type for all nodes so that loops that loop over all nodes
     * of a ViewDefinition stay monomorphic!
     * @record
     */
    /**
     * @record
     */
    /**
     * @record
     */
    /**
     * @record
     */
    /**
     * @record
     */
    /**
     * @record
     */
    /**
     * @record
     */
    /**
     * @record
     */
    /**
     * @record
     */
    /**
     * @record
     */
    /**
     * @record
     */
    /**
     * @record
     */
    /**
     * @record
     */

    /**
     * View instance data.
     * Attention: Adding fields to this is performance sensitive!
     * @record
     */
    /**
     * @param {?} view
     * @param {?} priorInitState
     * @param {?} newInitState
     * @return {?}
     */
    function shiftInitState(view, priorInitState, newInitState) {
        // Only update the InitState if we are currently in the prior state.
        // For example, only move into CallingInit if we are in BeforeInit. Only
        // move into CallingContentInit if we are in CallingInit. Normally this will
        // always be true because of how checkCycle is called in checkAndUpdateView.
        // However, if checkAndUpdateView is called recursively or if an exception is
        // thrown while checkAndUpdateView is running, checkAndUpdateView starts over
        // from the beginning. This ensures the state is monotonically increasing,
        // terminating in the AfterInit state, which ensures the Init methods are called
        // at least once and only once.
        var /** @type {?} */ state = view.state;
        var /** @type {?} */ initState = state & 1792;
        if (initState === priorInitState) {
            view.state = (state & ~1792 /* InitState_Mask */) | newInitState;
            view.initIndex = -1;
            return true;
        }
        return initState === newInitState;
    }

    /**
     * @param {?} view
     * @param {?} initState
     * @param {?} index
     * @return {?}
     */
    function shouldCallLifecycleInitHook(view, initState, index) {
        if ((view.state & 1792 /* InitState_Mask */) === initState && view.initIndex <= index) {
            view.initIndex = index + 1;
            return true;
        }
        return false;
    }

    /**
     * @record
     */

    /**
     * Data for an instantiated NodeType.Text.
     *
     * Attention: Adding fields to this is performance sensitive!
     * @record
     */
    /**
     * Accessor for view.nodes, enforcing that every usage site stays monomorphic.
     * @param {?} view
     * @param {?} index
     * @return {?}
     */
    function asTextData(view, index) {
        return /** @type {?} */ (view.nodes[index]);
    }

    /**
     * Data for an instantiated NodeType.Element.
     *
     * Attention: Adding fields to this is performance sensitive!
     * @record
     */
    /**
     * @record
     */

    /**
     * @record
     */
    /**
     * Accessor for view.nodes, enforcing that every usage site stays monomorphic.
     * @param {?} view
     * @param {?} index
     * @return {?}
     */
    function asElementData(view, index) {
        return /** @type {?} */ (view.nodes[index]);
    }

    /**
     * Data for an instantiated NodeType.Provider.
     *
     * Attention: Adding fields to this is performance sensitive!
     * @record
     */
    /**
     * Accessor for view.nodes, enforcing that every usage site stays monomorphic.
     * @param {?} view
     * @param {?} index
     * @return {?}
     */
    function asProviderData(view, index) {
        return /** @type {?} */ (view.nodes[index]);
    }

    /**
     * Data for an instantiated NodeType.PureExpression.
     *
     * Attention: Adding fields to this is performance sensitive!
     * @record
     */
    /**
     * Accessor for view.nodes, enforcing that every usage site stays monomorphic.
     * @param {?} view
     * @param {?} index
     * @return {?}
     */
    function asPureExpressionData(view, index) {
        return /** @type {?} */ (view.nodes[index]);
    }

    /**
     * Accessor for view.nodes, enforcing that every usage site stays monomorphic.
     * @param {?} view
     * @param {?} index
     * @return {?}
     */
    function asQueryList(view, index) {
        return /** @type {?} */ (view.nodes[index]);
    }

    /**
     * @record
     */
    /**
     * This object is used to prevent cycles in the source files and to have a place where
     * debug mode can hook it. It is lazily filled when `isDevMode` is known.
     */
    var Services = {
        setCurrentNode: /** @type {?} */ ((undefined)),
        createRootView: /** @type {?} */ ((undefined)),
        createEmbeddedView: /** @type {?} */ ((undefined)),
        createComponentView: /** @type {?} */ ((undefined)),
        createNgModuleRef: /** @type {?} */ ((undefined)),
        overrideProvider: /** @type {?} */ ((undefined)),
        overrideComponentView: /** @type {?} */ ((undefined)),
        clearOverrides: /** @type {?} */ ((undefined)),
        checkAndUpdateView: /** @type {?} */ ((undefined)),
        checkNoChangesView: /** @type {?} */ ((undefined)),
        destroyView: /** @type {?} */ ((undefined)),
        resolveDep: /** @type {?} */ ((undefined)),
        createDebugContext: /** @type {?} */ ((undefined)),
        handleEvent: /** @type {?} */ ((undefined)),
        updateDirectives: /** @type {?} */ ((undefined)),
        updateRenderer: /** @type {?} */ ((undefined)),
        dirtyParentQueries: /** @type {?} */ ((undefined)),
    };
    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */

    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * @param {?} context
     * @param {?} oldValue
     * @param {?} currValue
     * @param {?} isFirstCheck
     * @return {?}
     */
    function expressionChangedAfterItHasBeenCheckedError(context, oldValue, currValue, isFirstCheck) {
        var /** @type {?} */ msg = "ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked. Previous value: '" + oldValue + "'. Current value: '" + currValue + "'.";
        if (isFirstCheck) {
            msg +=
                " It seems like the view has been created after its parent and its children have been dirty checked." +
                " Has it been created in a change detection hook ?";
        }
        return viewDebugError(msg, context);
    }

    /**
     * @param {?} err
     * @param {?} context
     * @return {?}
     */
    function viewWrappedDebugError(err, context) {
        if (!(err instanceof Error)) {
            // errors that are not Error instances don't have a stack,
            // so it is ok to wrap them into a new Error object...
            err = new Error(err.toString());
        }
        _addDebugContext(err, context);
        return err;
    }

    /**
     * @param {?} msg
     * @param {?} context
     * @return {?}
     */
    function viewDebugError(msg, context) {
        var /** @type {?} */ err = new Error(msg);
        _addDebugContext(err, context);
        return err;
    }

    /**
     * @param {?} err
     * @param {?} context
     * @return {?}
     */
    function _addDebugContext(err, context) {
        ((err))[ERROR_DEBUG_CONTEXT] = context;
        ((err))[ERROR_LOGGER] = context.logError.bind(context);
    }

    /**
     * @param {?} err
     * @return {?}
     */
    function isViewDebugError(err) {
        return !!getDebugContext(err);
    }

    /**
     * @param {?} action
     * @return {?}
     */
    function viewDestroyedError(action) {
        return new Error("ViewDestroyedError: Attempt to use a destroyed view: " + action);
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var NOOP = function () {
    };
    var _tokenKeyCache = /*@__PURE__*/ new Map();

    /**
     * @param {?} token
     * @return {?}
     */
    function tokenKey(token) {
        var /** @type {?} */ key = _tokenKeyCache.get(token);
        if (!key) {
            key = stringify(token) + '_' + _tokenKeyCache.size;
            _tokenKeyCache.set(token, key);
        }
        return key;
    }

    var UNDEFINED_RENDERER_TYPE_ID = '$$undefined';
    var EMPTY_RENDERER_TYPE_ID = '$$empty';
    var _renderCompCount = 0;

    /**
     * @param {?=} type
     * @return {?}
     */
    function resolveRendererType2(type) {
        if (type && type.id === UNDEFINED_RENDERER_TYPE_ID) {
            // first time we see this RendererType2. Initialize it...
            var /** @type {?} */ isFilled = ((type.encapsulation != null && type.encapsulation !== ViewEncapsulation.None) ||
                type.styles.length || Object.keys(type.data).length);
            if (isFilled) {
                type.id = "c" + _renderCompCount++;
            }
            else {
                type.id = EMPTY_RENDERER_TYPE_ID;
            }
        }
        if (type && type.id === EMPTY_RENDERER_TYPE_ID) {
            type = null;
        }
        return type || null;
    }

    /**
     * @param {?} view
     * @param {?} def
     * @param {?} bindingIdx
     * @param {?} value
     * @return {?}
     */
    function checkBinding(view, def, bindingIdx, value) {
        var /** @type {?} */ oldValues = view.oldValues;
        if ((view.state & 2 /* FirstCheck */) ||
            !looseIdentical(oldValues[def.bindingIndex + bindingIdx], value)) {
            return true;
        }
        return false;
    }

    /**
     * @param {?} view
     * @param {?} def
     * @param {?} bindingIdx
     * @param {?} value
     * @return {?}
     */
    function checkAndUpdateBinding(view, def, bindingIdx, value) {
        if (checkBinding(view, def, bindingIdx, value)) {
            view.oldValues[def.bindingIndex + bindingIdx] = value;
            return true;
        }
        return false;
    }

    /**
     * @param {?} view
     * @param {?} def
     * @param {?} bindingIdx
     * @param {?} value
     * @return {?}
     */
    function checkBindingNoChanges(view, def, bindingIdx, value) {
        var /** @type {?} */ oldValue = view.oldValues[def.bindingIndex + bindingIdx];
        if ((view.state & 1 /* BeforeFirstCheck */) || !devModeEqual(oldValue, value)) {
            var /** @type {?} */ bindingName = def.bindings[bindingIdx].name;
            throw expressionChangedAfterItHasBeenCheckedError(Services.createDebugContext(view, def.nodeIndex), bindingName + ": " + oldValue, bindingName + ": " + value, (view.state & 1 /* BeforeFirstCheck */) !== 0);
        }
    }

    /**
     * @param {?} view
     * @return {?}
     */
    function markParentViewsForCheck(view) {
        var /** @type {?} */ currView = view;
        while (currView) {
            if (currView.def.flags & 2 /* OnPush */) {
                currView.state |= 8 /* ChecksEnabled */;
            }
            currView = currView.viewContainerParent || currView.parent;
        }
    }

    /**
     * @param {?} view
     * @param {?} endView
     * @return {?}
     */
    function markParentViewsForCheckProjectedViews(view, endView) {
        var /** @type {?} */ currView = view;
        while (currView && currView !== endView) {
            currView.state |= 64 /* CheckProjectedViews */;
            currView = currView.viewContainerParent || currView.parent;
        }
    }

    /**
     * @param {?} view
     * @param {?} nodeIndex
     * @param {?} eventName
     * @param {?} event
     * @return {?}
     */
    function dispatchEvent(view, nodeIndex, eventName, event) {
        try {
            var /** @type {?} */ nodeDef = view.def.nodes[nodeIndex];
            var /** @type {?} */ startView = nodeDef.flags & 33554432 /* ComponentView */ ?
                asElementData(view, nodeIndex).componentView :
                view;
            markParentViewsForCheck(startView);
            return Services.handleEvent(view, nodeIndex, eventName, event);
        }
        catch (e) {
            // Attention: Don't rethrow, as it would cancel Observable subscriptions!
            view.root.errorHandler.handleError(e);
        }
    }

    /**
     * @param {?} view
     * @return {?}
     */
    function declaredViewContainer(view) {
        if (view.parent) {
            var /** @type {?} */ parentView = view.parent;
            return asElementData(parentView, /** @type {?} */ ((view.parentNodeDef)).nodeIndex);
        }
        return null;
    }

    /**
     * for component views, this is the host element.
     * for embedded views, this is the index of the parent node
     * that contains the view container.
     * @param {?} view
     * @return {?}
     */
    function viewParentEl(view) {
        var /** @type {?} */ parentView = view.parent;
        if (parentView) {
            return /** @type {?} */ ((view.parentNodeDef)).parent;
        }
        else {
            return null;
        }
    }

    /**
     * @param {?} view
     * @param {?} def
     * @return {?}
     */
    function renderNode(view, def) {
        switch (def.flags & 201347067 /* Types */) {
            case 1 /* TypeElement */
            :
                return asElementData(view, def.nodeIndex).renderElement;
            case 2 /* TypeText */
            :
                return asTextData(view, def.nodeIndex).renderText;
        }
    }

    /**
     * @param {?} target
     * @param {?} name
     * @return {?}
     */
    function elementEventFullName(target, name) {
        return target ? target + ":" + name : name;
    }

    /**
     * @param {?} view
     * @return {?}
     */
    function isComponentView(view) {
        return !!view.parent && !!(((view.parentNodeDef)).flags & 32768 /* Component */);
    }

    /**
     * @param {?} view
     * @return {?}
     */
    function isEmbeddedView(view) {
        return !!view.parent && !(((view.parentNodeDef)).flags & 32768 /* Component */);
    }

    /**
     * @param {?} deps
     * @param {?=} sourceName
     * @return {?}
     */
    function splitDepsDsl(deps, sourceName) {
        return deps.map(function (value) {
            var /** @type {?} */ token;
            var /** @type {?} */ flags;
            if (Array.isArray(value)) {
                flags = value[0], token = value[1];
            }
            else {
                flags = 0 /* None */;
                token = value;
            }
            if (token && (typeof token === 'function' || typeof token === 'object') && sourceName) {
                Object.defineProperty(token, SOURCE, {value: sourceName, configurable: true});
            }
            return {flags: flags, token: token, tokenKey: tokenKey(token)};
        });
    }

    /**
     * @param {?} view
     * @param {?} renderHost
     * @param {?} def
     * @return {?}
     */
    function getParentRenderElement(view, renderHost, def) {
        var /** @type {?} */ renderParent = def.renderParent;
        if (renderParent) {
            if ((renderParent.flags & 1 /* TypeElement */) === 0 ||
                (renderParent.flags & 33554432 /* ComponentView */) === 0 ||
                (((renderParent.element)).componentRendererType && /** @type {?} */ ((((renderParent.element)).componentRendererType)).encapsulation === ViewEncapsulation.Native)) {
                // only children of non components, or children of components with native encapsulation should
                // be attached.
                return asElementData(view, /** @type {?} */ ((def.renderParent)).nodeIndex).renderElement;
            }
        }
        else {
            return renderHost;
        }
    }

    var DEFINITION_CACHE = /*@__PURE__*/ new WeakMap();

    /**
     * @template D
     * @param {?} factory
     * @return {?}
     */
    function resolveDefinition(factory) {
        var /** @type {?} */ value = (((DEFINITION_CACHE.get(factory))));
        if (!value) {
            value = factory(function () {
                return NOOP;
            });
            value.factory = factory;
            DEFINITION_CACHE.set(factory, value);
        }
        return value;
    }

    /**
     * @param {?} view
     * @return {?}
     */
    function rootRenderNodes(view) {
        var /** @type {?} */ renderNodes = [];
        visitRootRenderNodes(view, 0 /* Collect */, undefined, undefined, renderNodes);
        return renderNodes;
    }

    /**
     * @param {?} view
     * @param {?} action
     * @param {?} parentNode
     * @param {?} nextSibling
     * @param {?=} target
     * @return {?}
     */
    function visitRootRenderNodes(view, action, parentNode, nextSibling, target) {
        // We need to re-compute the parent node in case the nodes have been moved around manually
        if (action === 3 /* RemoveChild */) {
            parentNode = view.renderer.parentNode(renderNode(view, /** @type {?} */ ((view.def.lastRenderRootNode))));
        }
        visitSiblingRenderNodes(view, action, 0, view.def.nodes.length - 1, parentNode, nextSibling, target);
    }

    /**
     * @param {?} view
     * @param {?} action
     * @param {?} startIndex
     * @param {?} endIndex
     * @param {?} parentNode
     * @param {?} nextSibling
     * @param {?=} target
     * @return {?}
     */
    function visitSiblingRenderNodes(view, action, startIndex, endIndex, parentNode, nextSibling, target) {
        for (var /** @type {?} */ i = startIndex; i <= endIndex; i++) {
            var /** @type {?} */ nodeDef = view.def.nodes[i];
            if (nodeDef.flags & (1 /* TypeElement */ | 2 /* TypeText */ | 8 /* TypeNgContent */)) {
                visitRenderNode(view, nodeDef, action, parentNode, nextSibling, target);
            }
            // jump to next sibling
            i += nodeDef.childCount;
        }
    }

    /**
     * @param {?} view
     * @param {?} ngContentIndex
     * @param {?} action
     * @param {?} parentNode
     * @param {?} nextSibling
     * @param {?=} target
     * @return {?}
     */
    function visitProjectedRenderNodes(view, ngContentIndex, action, parentNode, nextSibling, target) {
        var /** @type {?} */ compView = view;
        while (compView && !isComponentView(compView)) {
            compView = compView.parent;
        }
        var /** @type {?} */ hostView = ((compView)).parent;
        var /** @type {?} */ hostElDef = viewParentEl(/** @type {?} */ ((compView)));
        var /** @type {?} */ startIndex = ((hostElDef)).nodeIndex + 1;
        var /** @type {?} */ endIndex = ((hostElDef)).nodeIndex + /** @type {?} */ ((hostElDef)).childCount;
        for (var /** @type {?} */ i = startIndex; i <= endIndex; i++) {
            var /** @type {?} */ nodeDef = ((hostView)).def.nodes[i];
            if (nodeDef.ngContentIndex === ngContentIndex) {
                visitRenderNode(/** @type {?} */ ((hostView)), nodeDef, action, parentNode, nextSibling, target);
            }
            // jump to next sibling
            i += nodeDef.childCount;
        }
        if (!((hostView)).parent) {
            // a root view
            var /** @type {?} */ projectedNodes = view.root.projectableNodes[ngContentIndex];
            if (projectedNodes) {
                for (var /** @type {?} */ i = 0; i < projectedNodes.length; i++) {
                    execRenderNodeAction(view, projectedNodes[i], action, parentNode, nextSibling, target);
                }
            }
        }
    }

    /**
     * @param {?} view
     * @param {?} nodeDef
     * @param {?} action
     * @param {?} parentNode
     * @param {?} nextSibling
     * @param {?=} target
     * @return {?}
     */
    function visitRenderNode(view, nodeDef, action, parentNode, nextSibling, target) {
        if (nodeDef.flags & 8 /* TypeNgContent */) {
            visitProjectedRenderNodes(view, /** @type {?} */ ((nodeDef.ngContent)).index, action, parentNode, nextSibling, target);
        }
        else {
            var /** @type {?} */ rn = renderNode(view, nodeDef);
            if (action === 3 /* RemoveChild */ && (nodeDef.flags & 33554432 /* ComponentView */) &&
                (nodeDef.bindingFlags & 48 /* CatSyntheticProperty */)) {
                // Note: we might need to do both actions.
                if (nodeDef.bindingFlags & (16 /* SyntheticProperty */)) {
                    execRenderNodeAction(view, rn, action, parentNode, nextSibling, target);
                }
                if (nodeDef.bindingFlags & (32 /* SyntheticHostProperty */)) {
                    var /** @type {?} */ compView = asElementData(view, nodeDef.nodeIndex).componentView;
                    execRenderNodeAction(compView, rn, action, parentNode, nextSibling, target);
                }
            }
            else {
                execRenderNodeAction(view, rn, action, parentNode, nextSibling, target);
            }
            if (nodeDef.flags & 16777216 /* EmbeddedViews */) {
                var /** @type {?} */ embeddedViews = ((asElementData(view, nodeDef.nodeIndex).viewContainer))._embeddedViews;
                for (var /** @type {?} */ k = 0; k < embeddedViews.length; k++) {
                    visitRootRenderNodes(embeddedViews[k], action, parentNode, nextSibling, target);
                }
            }
            if (nodeDef.flags & 1 /* TypeElement */ && !((nodeDef.element)).name) {
                visitSiblingRenderNodes(view, action, nodeDef.nodeIndex + 1, nodeDef.nodeIndex + nodeDef.childCount, parentNode, nextSibling, target);
            }
        }
    }

    /**
     * @param {?} view
     * @param {?} renderNode
     * @param {?} action
     * @param {?} parentNode
     * @param {?} nextSibling
     * @param {?=} target
     * @return {?}
     */
    function execRenderNodeAction(view, renderNode, action, parentNode, nextSibling, target) {
        var /** @type {?} */ renderer = view.renderer;
        switch (action) {
            case 1 /* AppendChild */
            :
                renderer.appendChild(parentNode, renderNode);
                break;
            case 2 /* InsertBefore */
            :
                renderer.insertBefore(parentNode, renderNode, nextSibling);
                break;
            case 3 /* RemoveChild */
            :
                renderer.removeChild(parentNode, renderNode);
                break;
            case 0 /* Collect */
            :
                /** @type {?} */ ((target)).push(renderNode);
                break;
        }
    }

    var NS_PREFIX_RE = /^:([^:]+):(.+)$/;

    /**
     * @param {?} name
     * @return {?}
     */
    function splitNamespace(name) {
        if (name[0] === ':') {
            var /** @type {?} */ match = ((name.match(NS_PREFIX_RE)));
            return [match[1], match[2]];
        }
        return ['', name];
    }

    /**
     * @param {?} view
     * @param {?} renderHost
     * @param {?} def
     * @return {?}
     */
    function createElement(view, renderHost, def) {
        var /** @type {?} */ elDef = ((def.element));
        var /** @type {?} */ rootSelectorOrNode = view.root.selectorOrNode;
        var /** @type {?} */ renderer = view.renderer;
        var /** @type {?} */ el;
        if (view.parent || !rootSelectorOrNode) {
            if (elDef.name) {
                el = renderer.createElement(elDef.name, elDef.ns);
            }
            else {
                el = renderer.createComment('');
            }
            var /** @type {?} */ parentEl = getParentRenderElement(view, renderHost, def);
            if (parentEl) {
                renderer.appendChild(parentEl, el);
            }
        }
        else {
            el = renderer.selectRootElement(rootSelectorOrNode);
        }
        if (elDef.attrs) {
            for (var /** @type {?} */ i = 0; i < elDef.attrs.length; i++) {
                var _a = elDef.attrs[i], ns = _a[0], name_2 = _a[1], value = _a[2];
                renderer.setAttribute(el, name_2, value, ns);
            }
        }
        return el;
    }

    /**
     * @param {?} view
     * @param {?} compView
     * @param {?} def
     * @param {?} el
     * @return {?}
     */
    function listenToElementOutputs(view, compView, def, el) {
        for (var /** @type {?} */ i = 0; i < def.outputs.length; i++) {
            var /** @type {?} */ output = def.outputs[i];
            var /** @type {?} */ handleEventClosure = renderEventHandlerClosure(view, def.nodeIndex, elementEventFullName(output.target, output.eventName));
            var /** @type {?} */ listenTarget = output.target;
            var /** @type {?} */ listenerView = view;
            if (output.target === 'component') {
                listenTarget = null;
                listenerView = compView;
            }
            var /** @type {?} */ disposable = (listenerView.renderer.listen(listenTarget || el, output.eventName, handleEventClosure));
            /** @type {?} */
            ((view.disposables))[def.outputIndex + i] = disposable;
        }
    }

    /**
     * @param {?} view
     * @param {?} index
     * @param {?} eventName
     * @return {?}
     */
    function renderEventHandlerClosure(view, index, eventName) {
        return function (event) {
            return dispatchEvent(view, index, eventName, event);
        };
    }

    /**
     * @param {?} view
     * @param {?} def
     * @param {?} v0
     * @param {?} v1
     * @param {?} v2
     * @param {?} v3
     * @param {?} v4
     * @param {?} v5
     * @param {?} v6
     * @param {?} v7
     * @param {?} v8
     * @param {?} v9
     * @return {?}
     */
    function checkAndUpdateElementInline(view, def, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9) {
        var /** @type {?} */ bindLen = def.bindings.length;
        var /** @type {?} */ changed = false;
        if (bindLen > 0 && checkAndUpdateElementValue(view, def, 0, v0))
            changed = true;
        if (bindLen > 1 && checkAndUpdateElementValue(view, def, 1, v1))
            changed = true;
        if (bindLen > 2 && checkAndUpdateElementValue(view, def, 2, v2))
            changed = true;
        if (bindLen > 3 && checkAndUpdateElementValue(view, def, 3, v3))
            changed = true;
        if (bindLen > 4 && checkAndUpdateElementValue(view, def, 4, v4))
            changed = true;
        if (bindLen > 5 && checkAndUpdateElementValue(view, def, 5, v5))
            changed = true;
        if (bindLen > 6 && checkAndUpdateElementValue(view, def, 6, v6))
            changed = true;
        if (bindLen > 7 && checkAndUpdateElementValue(view, def, 7, v7))
            changed = true;
        if (bindLen > 8 && checkAndUpdateElementValue(view, def, 8, v8))
            changed = true;
        if (bindLen > 9 && checkAndUpdateElementValue(view, def, 9, v9))
            changed = true;
        return changed;
    }

    /**
     * @param {?} view
     * @param {?} def
     * @param {?} values
     * @return {?}
     */
    function checkAndUpdateElementDynamic(view, def, values) {
        var /** @type {?} */ changed = false;
        for (var /** @type {?} */ i = 0; i < values.length; i++) {
            if (checkAndUpdateElementValue(view, def, i, values[i]))
                changed = true;
        }
        return changed;
    }

    /**
     * @param {?} view
     * @param {?} def
     * @param {?} bindingIdx
     * @param {?} value
     * @return {?}
     */
    function checkAndUpdateElementValue(view, def, bindingIdx, value) {
        if (!checkAndUpdateBinding(view, def, bindingIdx, value)) {
            return false;
        }
        var /** @type {?} */ binding = def.bindings[bindingIdx];
        var /** @type {?} */ elData = asElementData(view, def.nodeIndex);
        var /** @type {?} */ renderNode$$1 = elData.renderElement;
        var /** @type {?} */ name = ((binding.name));
        switch (binding.flags & 15 /* Types */) {
            case 1 /* TypeElementAttribute */
            :
                setElementAttribute(view, binding, renderNode$$1, binding.ns, name, value);
                break;
            case 2 /* TypeElementClass */
            :
                setElementClass(view, renderNode$$1, name, value);
                break;
            case 4 /* TypeElementStyle */
            :
                setElementStyle(view, binding, renderNode$$1, name, value);
                break;
            case 8 /* TypeProperty */
            :
                var /** @type {?} */ bindView = (def.flags & 33554432 /* ComponentView */ &&
                    binding.flags & 32 /* SyntheticHostProperty */) ?
                    elData.componentView :
                    view;
                setElementProperty(bindView, binding, renderNode$$1, name, value);
                break;
        }
        return true;
    }

    /**
     * @param {?} view
     * @param {?} binding
     * @param {?} renderNode
     * @param {?} ns
     * @param {?} name
     * @param {?} value
     * @return {?}
     */
    function setElementAttribute(view, binding, renderNode$$1, ns, name, value) {
        var /** @type {?} */ securityContext = binding.securityContext;
        var /** @type {?} */ renderValue = securityContext ? view.root.sanitizer.sanitize(securityContext, value) : value;
        renderValue = renderValue != null ? renderValue.toString() : null;
        var /** @type {?} */ renderer = view.renderer;
        if (value != null) {
            renderer.setAttribute(renderNode$$1, name, renderValue, ns);
        }
        else {
            renderer.removeAttribute(renderNode$$1, name, ns);
        }
    }

    /**
     * @param {?} view
     * @param {?} renderNode
     * @param {?} name
     * @param {?} value
     * @return {?}
     */
    function setElementClass(view, renderNode$$1, name, value) {
        var /** @type {?} */ renderer = view.renderer;
        if (value) {
            renderer.addClass(renderNode$$1, name);
        }
        else {
            renderer.removeClass(renderNode$$1, name);
        }
    }

    /**
     * @param {?} view
     * @param {?} binding
     * @param {?} renderNode
     * @param {?} name
     * @param {?} value
     * @return {?}
     */
    function setElementStyle(view, binding, renderNode$$1, name, value) {
        var /** @type {?} */ renderValue = view.root.sanitizer.sanitize(SecurityContext.STYLE, /** @type {?} */ (value));
        if (renderValue != null) {
            renderValue = renderValue.toString();
            var /** @type {?} */ unit = binding.suffix;
            if (unit != null) {
                renderValue = renderValue + unit;
            }
        }
        else {
            renderValue = null;
        }
        var /** @type {?} */ renderer = view.renderer;
        if (renderValue != null) {
            renderer.setStyle(renderNode$$1, name, renderValue);
        }
        else {
            renderer.removeStyle(renderNode$$1, name);
        }
    }

    /**
     * @param {?} view
     * @param {?} binding
     * @param {?} renderNode
     * @param {?} name
     * @param {?} value
     * @return {?}
     */
    function setElementProperty(view, binding, renderNode$$1, name, value) {
        var /** @type {?} */ securityContext = binding.securityContext;
        var /** @type {?} */ renderValue = securityContext ? view.root.sanitizer.sanitize(securityContext, value) : value;
        view.renderer.setProperty(renderNode$$1, name, renderValue);
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var UNDEFINED_VALUE = /*@__PURE__*/ new Object();
    var InjectorRefTokenKey$1 = /*@__PURE__*/ tokenKey(Injector);
    var NgModuleRefTokenKey = /*@__PURE__*/ tokenKey(NgModuleRef);

    /**
     * @param {?} data
     * @return {?}
     */
    function initNgModule(data) {
        var /** @type {?} */ def = data._def;
        var /** @type {?} */ providers = data._providers = new Array(def.providers.length);
        for (var /** @type {?} */ i = 0; i < def.providers.length; i++) {
            var /** @type {?} */ provDef = def.providers[i];
            if (!(provDef.flags & 4096 /* LazyProvider */)) {
                providers[i] = _createProviderInstance$1(data, provDef);
            }
        }
    }

    /**
     * @param {?} data
     * @param {?} depDef
     * @param {?=} notFoundValue
     * @return {?}
     */
    function resolveNgModuleDep(data, depDef, notFoundValue) {
        if (notFoundValue === void 0) {
            notFoundValue = Injector.THROW_IF_NOT_FOUND;
        }
        if (depDef.flags & 8 /* Value */) {
            return depDef.token;
        }
        if (depDef.flags & 2 /* Optional */) {
            notFoundValue = null;
        }
        if (depDef.flags & 1 /* SkipSelf */) {
            return data._parent.get(depDef.token, notFoundValue);
        }
        var /** @type {?} */ tokenKey$$1 = depDef.tokenKey;
        switch (tokenKey$$1) {
            case InjectorRefTokenKey$1:
            case NgModuleRefTokenKey:
                return data;
        }
        var /** @type {?} */ providerDef = data._def.providersByKey[tokenKey$$1];
        if (providerDef) {
            var /** @type {?} */ providerInstance = data._providers[providerDef.index];
            if (providerInstance === undefined) {
                providerInstance = data._providers[providerDef.index] =
                    _createProviderInstance$1(data, providerDef);
            }
            return providerInstance === UNDEFINED_VALUE ? undefined : providerInstance;
        }
        return data._parent.get(depDef.token, notFoundValue);
    }

    /**
     * @param {?} ngModule
     * @param {?} providerDef
     * @return {?}
     */
    function _createProviderInstance$1(ngModule, providerDef) {
        var /** @type {?} */ injectable;
        switch (providerDef.flags & 201347067 /* Types */) {
            case 512 /* TypeClassProvider */
            :
                injectable = _createClass(ngModule, providerDef.value, providerDef.deps);
                break;
            case 1024 /* TypeFactoryProvider */
            :
                injectable = _callFactory(ngModule, providerDef.value, providerDef.deps);
                break;
            case 2048 /* TypeUseExistingProvider */
            :
                injectable = resolveNgModuleDep(ngModule, providerDef.deps[0]);
                break;
            case 256 /* TypeValueProvider */
            :
                injectable = providerDef.value;
                break;
        }
        return injectable === undefined ? UNDEFINED_VALUE : injectable;
    }

    /**
     * @param {?} ngModule
     * @param {?} ctor
     * @param {?} deps
     * @return {?}
     */
    function _createClass(ngModule, ctor, deps) {
        var /** @type {?} */ len = deps.length;
        switch (len) {
            case 0:
                return new ctor();
            case 1:
                return new ctor(resolveNgModuleDep(ngModule, deps[0]));
            case 2:
                return new ctor(resolveNgModuleDep(ngModule, deps[0]), resolveNgModuleDep(ngModule, deps[1]));
            case 3:
                return new ctor(resolveNgModuleDep(ngModule, deps[0]), resolveNgModuleDep(ngModule, deps[1]), resolveNgModuleDep(ngModule, deps[2]));
            default:
                var /** @type {?} */ depValues = new Array(len);
                for (var /** @type {?} */ i = 0; i < len; i++) {
                    depValues[i] = resolveNgModuleDep(ngModule, deps[i]);
                }
                return new (ctor.bind.apply(ctor, [void 0].concat(depValues)))();
        }
    }

    /**
     * @param {?} ngModule
     * @param {?} factory
     * @param {?} deps
     * @return {?}
     */
    function _callFactory(ngModule, factory, deps) {
        var /** @type {?} */ len = deps.length;
        switch (len) {
            case 0:
                return factory();
            case 1:
                return factory(resolveNgModuleDep(ngModule, deps[0]));
            case 2:
                return factory(resolveNgModuleDep(ngModule, deps[0]), resolveNgModuleDep(ngModule, deps[1]));
            case 3:
                return factory(resolveNgModuleDep(ngModule, deps[0]), resolveNgModuleDep(ngModule, deps[1]), resolveNgModuleDep(ngModule, deps[2]));
            default:
                var /** @type {?} */ depValues = Array(len);
                for (var /** @type {?} */ i = 0; i < len; i++) {
                    depValues[i] = resolveNgModuleDep(ngModule, deps[i]);
                }
                return factory.apply(void 0, depValues);
        }
    }

    /**
     * @param {?} ngModule
     * @param {?} lifecycles
     * @return {?}
     */
    function callNgModuleLifecycle(ngModule, lifecycles) {
        var /** @type {?} */ def = ngModule._def;
        for (var /** @type {?} */ i = 0; i < def.providers.length; i++) {
            var /** @type {?} */ provDef = def.providers[i];
            if (provDef.flags & 131072 /* OnDestroy */) {
                var /** @type {?} */ instance = ngModule._providers[i];
                if (instance && instance !== UNDEFINED_VALUE) {
                    instance.ngOnDestroy();
                }
            }
        }
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */

    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * @param {?} parentView
     * @param {?} elementData
     * @param {?} viewIndex
     * @param {?} view
     * @return {?}
     */
    function attachEmbeddedView(parentView, elementData, viewIndex, view) {
        var /** @type {?} */ embeddedViews = ((elementData.viewContainer))._embeddedViews;
        if (viewIndex === null || viewIndex === undefined) {
            viewIndex = embeddedViews.length;
        }
        view.viewContainerParent = parentView;
        addToArray(embeddedViews, /** @type {?} */ ((viewIndex)), view);
        attachProjectedView(elementData, view);
        Services.dirtyParentQueries(view);
        var /** @type {?} */ prevView = ((viewIndex)) > 0 ? embeddedViews[((viewIndex)) - 1] : null;
        renderAttachEmbeddedView(elementData, prevView, view);
    }

    /**
     * @param {?} vcElementData
     * @param {?} view
     * @return {?}
     */
    function attachProjectedView(vcElementData, view) {
        var /** @type {?} */ dvcElementData = declaredViewContainer(view);
        if (!dvcElementData || dvcElementData === vcElementData ||
            view.state & 16 /* IsProjectedView */) {
            return;
        }
        // Note: For performance reasons, we
        // - add a view to template._projectedViews only 1x throughout its lifetime,
        //   and remove it not until the view is destroyed.
        //   (hard, as when a parent view is attached/detached we would need to attach/detach all
        //    nested projected views as well, even accross component boundaries).
        // - don't track the insertion order of views in the projected views array
        //   (hard, as when the views of the same template are inserted different view containers)
        view.state |= 16 /* IsProjectedView */;
        var /** @type {?} */ projectedViews = dvcElementData.template._projectedViews;
        if (!projectedViews) {
            projectedViews = dvcElementData.template._projectedViews = [];
        }
        projectedViews.push(view);
        // Note: we are changing the NodeDef here as we cannot calculate
        // the fact whether a template is used for projection during compilation.
        markNodeAsProjectedTemplate(/** @type {?} */ ((view.parent)).def, /** @type {?} */ ((view.parentNodeDef)));
    }

    /**
     * @param {?} viewDef
     * @param {?} nodeDef
     * @return {?}
     */
    function markNodeAsProjectedTemplate(viewDef, nodeDef) {
        if (nodeDef.flags & 4 /* ProjectedTemplate */) {
            return;
        }
        viewDef.nodeFlags |= 4 /* ProjectedTemplate */;
        nodeDef.flags |= 4 /* ProjectedTemplate */;
        var /** @type {?} */ parentNodeDef = nodeDef.parent;
        while (parentNodeDef) {
            parentNodeDef.childFlags |= 4 /* ProjectedTemplate */;
            parentNodeDef = parentNodeDef.parent;
        }
    }

    /**
     * @param {?} elementData
     * @param {?=} viewIndex
     * @return {?}
     */
    function detachEmbeddedView(elementData, viewIndex) {
        var /** @type {?} */ embeddedViews = ((elementData.viewContainer))._embeddedViews;
        if (viewIndex == null || viewIndex >= embeddedViews.length) {
            viewIndex = embeddedViews.length - 1;
        }
        if (viewIndex < 0) {
            return null;
        }
        var /** @type {?} */ view = embeddedViews[viewIndex];
        view.viewContainerParent = null;
        removeFromArray(embeddedViews, viewIndex);
        // See attachProjectedView for why we don't update projectedViews here.
        Services.dirtyParentQueries(view);
        renderDetachView(view);
        return view;
    }

    /**
     * @param {?} view
     * @return {?}
     */
    function detachProjectedView(view) {
        if (!(view.state & 16 /* IsProjectedView */)) {
            return;
        }
        var /** @type {?} */ dvcElementData = declaredViewContainer(view);
        if (dvcElementData) {
            var /** @type {?} */ projectedViews = dvcElementData.template._projectedViews;
            if (projectedViews) {
                removeFromArray(projectedViews, projectedViews.indexOf(view));
                Services.dirtyParentQueries(view);
            }
        }
    }

    /**
     * @param {?} elementData
     * @param {?} oldViewIndex
     * @param {?} newViewIndex
     * @return {?}
     */
    function moveEmbeddedView(elementData, oldViewIndex, newViewIndex) {
        var /** @type {?} */ embeddedViews = ((elementData.viewContainer))._embeddedViews;
        var /** @type {?} */ view = embeddedViews[oldViewIndex];
        removeFromArray(embeddedViews, oldViewIndex);
        if (newViewIndex == null) {
            newViewIndex = embeddedViews.length;
        }
        addToArray(embeddedViews, newViewIndex, view);
        // Note: Don't need to change projectedViews as the order in there
        // as always invalid...
        Services.dirtyParentQueries(view);
        renderDetachView(view);
        var /** @type {?} */ prevView = newViewIndex > 0 ? embeddedViews[newViewIndex - 1] : null;
        renderAttachEmbeddedView(elementData, prevView, view);
        return view;
    }

    /**
     * @param {?} elementData
     * @param {?} prevView
     * @param {?} view
     * @return {?}
     */
    function renderAttachEmbeddedView(elementData, prevView, view) {
        var /** @type {?} */ prevRenderNode = prevView ? renderNode(prevView, /** @type {?} */ ((prevView.def.lastRenderRootNode))) :
            elementData.renderElement;
        var /** @type {?} */ parentNode = view.renderer.parentNode(prevRenderNode);
        var /** @type {?} */ nextSibling = view.renderer.nextSibling(prevRenderNode);
        // Note: We can't check if `nextSibling` is present, as on WebWorkers it will always be!
        // However, browsers automatically do `appendChild` when there is no `nextSibling`.
        visitRootRenderNodes(view, 2 /* InsertBefore */, parentNode, nextSibling, undefined);
    }

    /**
     * @param {?} view
     * @return {?}
     */
    function renderDetachView(view) {
        visitRootRenderNodes(view, 3 /* RemoveChild */, null, null, undefined);
    }

    /**
     * @param {?} arr
     * @param {?} index
     * @param {?} value
     * @return {?}
     */
    function addToArray(arr, index, value) {
        // perf: array.push is faster than array.splice!
        if (index >= arr.length) {
            arr.push(value);
        }
        else {
            arr.splice(index, 0, value);
        }
    }

    /**
     * @param {?} arr
     * @param {?} index
     * @return {?}
     */
    function removeFromArray(arr, index) {
        // perf: array.pop is faster than array.splice!
        if (index >= arr.length - 1) {
            arr.pop();
        }
        else {
            arr.splice(index, 1);
        }
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var EMPTY_CONTEXT = /*@__PURE__*/ new Object();

    /**
     * @param {?} componentFactory
     * @return {?}
     */
    function getComponentViewDefinitionFactory(componentFactory) {
        return ((componentFactory)).viewDefFactory;
    }

    var ComponentFactory_ = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
        __extends(ComponentFactory_, _super);

        function ComponentFactory_(selector, componentType, viewDefFactory, _inputs, _outputs, ngContentSelectors) {
            var _this =
                // Attention: this ctor is called as top level function.
                // Putting any logic in here will destroy closure tree shaking!
                _super.call(this) || this;
            _this.selector = selector;
            _this.componentType = componentType;
            _this._inputs = _inputs;
            _this._outputs = _outputs;
            _this.ngContentSelectors = ngContentSelectors;
            _this.viewDefFactory = viewDefFactory;
            return _this;
        }

        Object.defineProperty(ComponentFactory_.prototype, "inputs", {
            get: /**
             * @return {?}
             */ function () {
                var /** @type {?} */ inputsArr = [];
                var /** @type {?} */ inputs = ((this._inputs));
                for (var /** @type {?} */ propName in inputs) {
                    var /** @type {?} */ templateName = inputs[propName];
                    inputsArr.push({propName: propName, templateName: templateName});
                }
                return inputsArr;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ComponentFactory_.prototype, "outputs", {
            get: /**
             * @return {?}
             */ function () {
                var /** @type {?} */ outputsArr = [];
                for (var /** @type {?} */ propName in this._outputs) {
                    var /** @type {?} */ templateName = this._outputs[propName];
                    outputsArr.push({propName: propName, templateName: templateName});
                }
                return outputsArr;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Creates a new component.
         */
        /**
         * Creates a new component.
         * @param {?} injector
         * @param {?=} projectableNodes
         * @param {?=} rootSelectorOrNode
         * @param {?=} ngModule
         * @return {?}
         */
        ComponentFactory_.prototype.create = /**
         * Creates a new component.
         * @param {?} injector
         * @param {?=} projectableNodes
         * @param {?=} rootSelectorOrNode
         * @param {?=} ngModule
         * @return {?}
         */
        function (injector, projectableNodes, rootSelectorOrNode, ngModule) {
            if (!ngModule) {
                throw new Error('ngModule should be provided');
            }
            var /** @type {?} */ viewDef = resolveDefinition(this.viewDefFactory);
            var /** @type {?} */ componentNodeIndex = ((((viewDef.nodes[0].element)).componentProvider)).nodeIndex;
            var /** @type {?} */ view = Services.createRootView(injector, projectableNodes || [], rootSelectorOrNode, viewDef, ngModule, EMPTY_CONTEXT);
            var /** @type {?} */ component = asProviderData(view, componentNodeIndex).instance;
            if (rootSelectorOrNode) {
                view.renderer.setAttribute(asElementData(view, 0).renderElement, 'ng-version', VERSION.full);
            }
            return new ComponentRef_(view, new ViewRef_(view), component);
        };
        return ComponentFactory_;
    }(ComponentFactory));
    var ComponentRef_ = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
        __extends(ComponentRef_, _super);

        function ComponentRef_(_view, _viewRef, _component) {
            var _this = _super.call(this) || this;
            _this._view = _view;
            _this._viewRef = _viewRef;
            _this._component = _component;
            _this._elDef = _this._view.def.nodes[0];
            _this.hostView = _viewRef;
            _this.changeDetectorRef = _viewRef;
            _this.instance = _component;
            return _this;
        }

        Object.defineProperty(ComponentRef_.prototype, "location", {
            get: /**
             * @return {?}
             */ function () {
                return new ElementRef(asElementData(this._view, this._elDef.nodeIndex).renderElement);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ComponentRef_.prototype, "injector", {
            get: /**
             * @return {?}
             */ function () {
                return new Injector_(this._view, this._elDef);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ComponentRef_.prototype, "componentType", {
            get: /**
             * @return {?}
             */ function () {
                return /** @type {?} */ (this._component.constructor);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @return {?}
         */
        ComponentRef_.prototype.destroy = /**
         * @return {?}
         */
        function () {
            this._viewRef.destroy();
        };
        /**
         * @param {?} callback
         * @return {?}
         */
        ComponentRef_.prototype.onDestroy = /**
         * @param {?} callback
         * @return {?}
         */
        function (callback) {
            this._viewRef.onDestroy(callback);
        };
        return ComponentRef_;
    }(ComponentRef));

    /**
     * @param {?} view
     * @param {?} elDef
     * @param {?} elData
     * @return {?}
     */
    function createViewContainerData(view, elDef, elData) {
        return new ViewContainerRef_(view, elDef, elData);
    }

    var ViewContainerRef_ = /*@__PURE__*/ (/*@__PURE__*/ function () {
        function ViewContainerRef_(_view, _elDef, _data) {
            this._view = _view;
            this._elDef = _elDef;
            this._data = _data;
            /**
             * \@internal
             */
            this._embeddedViews = [];
        }

        Object.defineProperty(ViewContainerRef_.prototype, "element", {
            get: /**
             * @return {?}
             */ function () {
                return new ElementRef(this._data.renderElement);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewContainerRef_.prototype, "injector", {
            get: /**
             * @return {?}
             */ function () {
                return new Injector_(this._view, this._elDef);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewContainerRef_.prototype, "parentInjector", {
            get: /**
             * @return {?}
             */ function () {
                var /** @type {?} */ view = this._view;
                var /** @type {?} */ elDef = this._elDef.parent;
                while (!elDef && view) {
                    elDef = viewParentEl(view);
                    view = /** @type {?} */ ((view.parent));
                }
                return view ? new Injector_(view, elDef) : new Injector_(this._view, null);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @return {?}
         */
        ViewContainerRef_.prototype.clear = /**
         * @return {?}
         */
        function () {
            var /** @type {?} */ len = this._embeddedViews.length;
            for (var /** @type {?} */ i = len - 1; i >= 0; i--) {
                var /** @type {?} */ view = ((detachEmbeddedView(this._data, i)));
                Services.destroyView(view);
            }
        };
        /**
         * @param {?} index
         * @return {?}
         */
        ViewContainerRef_.prototype.get = /**
         * @param {?} index
         * @return {?}
         */
        function (index) {
            var /** @type {?} */ view = this._embeddedViews[index];
            if (view) {
                var /** @type {?} */ ref = new ViewRef_(view);
                ref.attachToViewContainerRef(this);
                return ref;
            }
            return null;
        };
        Object.defineProperty(ViewContainerRef_.prototype, "length", {
            get: /**
             * @return {?}
             */ function () {
                return this._embeddedViews.length;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @template C
         * @param {?} templateRef
         * @param {?=} context
         * @param {?=} index
         * @return {?}
         */
        ViewContainerRef_.prototype.createEmbeddedView = /**
         * @template C
         * @param {?} templateRef
         * @param {?=} context
         * @param {?=} index
         * @return {?}
         */
        function (templateRef, context, index) {
            var /** @type {?} */ viewRef = templateRef.createEmbeddedView(context || /** @type {?} */ ({}));
            this.insert(viewRef, index);
            return viewRef;
        };
        /**
         * @template C
         * @param {?} componentFactory
         * @param {?=} index
         * @param {?=} injector
         * @param {?=} projectableNodes
         * @param {?=} ngModuleRef
         * @return {?}
         */
        ViewContainerRef_.prototype.createComponent = /**
         * @template C
         * @param {?} componentFactory
         * @param {?=} index
         * @param {?=} injector
         * @param {?=} projectableNodes
         * @param {?=} ngModuleRef
         * @return {?}
         */
        function (componentFactory, index, injector, projectableNodes, ngModuleRef) {
            var /** @type {?} */ contextInjector = injector || this.parentInjector;
            if (!ngModuleRef && !(componentFactory instanceof ComponentFactoryBoundToModule)) {
                ngModuleRef = contextInjector.get(NgModuleRef);
            }
            var /** @type {?} */ componentRef = componentFactory.create(contextInjector, projectableNodes, undefined, ngModuleRef);
            this.insert(componentRef.hostView, index);
            return componentRef;
        };
        /**
         * @param {?} viewRef
         * @param {?=} index
         * @return {?}
         */
        ViewContainerRef_.prototype.insert = /**
         * @param {?} viewRef
         * @param {?=} index
         * @return {?}
         */
        function (viewRef, index) {
            if (viewRef.destroyed) {
                throw new Error('Cannot insert a destroyed View in a ViewContainer!');
            }
            var /** @type {?} */ viewRef_ = (viewRef);
            var /** @type {?} */ viewData = viewRef_._view;
            attachEmbeddedView(this._view, this._data, index, viewData);
            viewRef_.attachToViewContainerRef(this);
            return viewRef;
        };
        /**
         * @param {?} viewRef
         * @param {?} currentIndex
         * @return {?}
         */
        ViewContainerRef_.prototype.move = /**
         * @param {?} viewRef
         * @param {?} currentIndex
         * @return {?}
         */
        function (viewRef, currentIndex) {
            if (viewRef.destroyed) {
                throw new Error('Cannot move a destroyed View in a ViewContainer!');
            }
            var /** @type {?} */ previousIndex = this._embeddedViews.indexOf(viewRef._view);
            moveEmbeddedView(this._data, previousIndex, currentIndex);
            return viewRef;
        };
        /**
         * @param {?} viewRef
         * @return {?}
         */
        ViewContainerRef_.prototype.indexOf = /**
         * @param {?} viewRef
         * @return {?}
         */
        function (viewRef) {
            return this._embeddedViews.indexOf(((viewRef))._view);
        };
        /**
         * @param {?=} index
         * @return {?}
         */
        ViewContainerRef_.prototype.remove = /**
         * @param {?=} index
         * @return {?}
         */
        function (index) {
            var /** @type {?} */ viewData = detachEmbeddedView(this._data, index);
            if (viewData) {
                Services.destroyView(viewData);
            }
        };
        /**
         * @param {?=} index
         * @return {?}
         */
        ViewContainerRef_.prototype.detach = /**
         * @param {?=} index
         * @return {?}
         */
        function (index) {
            var /** @type {?} */ view = detachEmbeddedView(this._data, index);
            return view ? new ViewRef_(view) : null;
        };
        return ViewContainerRef_;
    }());

    /**
     * @param {?} view
     * @return {?}
     */
    function createChangeDetectorRef(view) {
        return new ViewRef_(view);
    }

    var ViewRef_ = /*@__PURE__*/ (/*@__PURE__*/ function () {
        function ViewRef_(_view) {
            this._view = _view;
            this._viewContainerRef = null;
            this._appRef = null;
        }

        Object.defineProperty(ViewRef_.prototype, "rootNodes", {
            get: /**
             * @return {?}
             */ function () {
                return rootRenderNodes(this._view);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewRef_.prototype, "context", {
            get: /**
             * @return {?}
             */ function () {
                return this._view.context;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewRef_.prototype, "destroyed", {
            get: /**
             * @return {?}
             */ function () {
                return (this._view.state & 128 /* Destroyed */) !== 0;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @return {?}
         */
        ViewRef_.prototype.markForCheck = /**
         * @return {?}
         */
        function () {
            markParentViewsForCheck(this._view);
        };
        /**
         * @return {?}
         */
        ViewRef_.prototype.detach = /**
         * @return {?}
         */
        function () {
            this._view.state &= ~4 /* Attached */;
        };
        /**
         * @return {?}
         */
        ViewRef_.prototype.detectChanges = /**
         * @return {?}
         */
        function () {
            var /** @type {?} */ fs = this._view.root.rendererFactory;
            if (fs.begin) {
                fs.begin();
            }
            try {
                Services.checkAndUpdateView(this._view);
            }
            finally {
                if (fs.end) {
                    fs.end();
                }
            }
        };
        /**
         * @return {?}
         */
        ViewRef_.prototype.checkNoChanges = /**
         * @return {?}
         */
        function () {
            Services.checkNoChangesView(this._view);
        };
        /**
         * @return {?}
         */
        ViewRef_.prototype.reattach = /**
         * @return {?}
         */
        function () {
            this._view.state |= 4 /* Attached */;
        };
        /**
         * @param {?} callback
         * @return {?}
         */
        ViewRef_.prototype.onDestroy = /**
         * @param {?} callback
         * @return {?}
         */
        function (callback) {
            if (!this._view.disposables) {
                this._view.disposables = [];
            }
            this._view.disposables.push(/** @type {?} */ (callback));
        };
        /**
         * @return {?}
         */
        ViewRef_.prototype.destroy = /**
         * @return {?}
         */
        function () {
            if (this._appRef) {
                this._appRef.detachView(this);
            }
            else if (this._viewContainerRef) {
                this._viewContainerRef.detach(this._viewContainerRef.indexOf(this));
            }
            Services.destroyView(this._view);
        };
        /**
         * @return {?}
         */
        ViewRef_.prototype.detachFromAppRef = /**
         * @return {?}
         */
        function () {
            this._appRef = null;
            renderDetachView(this._view);
            Services.dirtyParentQueries(this._view);
        };
        /**
         * @param {?} appRef
         * @return {?}
         */
        ViewRef_.prototype.attachToAppRef = /**
         * @param {?} appRef
         * @return {?}
         */
        function (appRef) {
            if (this._viewContainerRef) {
                throw new Error('This view is already attached to a ViewContainer!');
            }
            this._appRef = appRef;
        };
        /**
         * @param {?} vcRef
         * @return {?}
         */
        ViewRef_.prototype.attachToViewContainerRef = /**
         * @param {?} vcRef
         * @return {?}
         */
        function (vcRef) {
            if (this._appRef) {
                throw new Error('This view is already attached directly to the ApplicationRef!');
            }
            this._viewContainerRef = vcRef;
        };
        return ViewRef_;
    }());

    /**
     * @param {?} view
     * @param {?} def
     * @return {?}
     */
    function createTemplateData(view, def) {
        return new TemplateRef_(view, def);
    }

    var TemplateRef_ = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
        __extends(TemplateRef_, _super);

        function TemplateRef_(_parentView, _def) {
            var _this = _super.call(this) || this;
            _this._parentView = _parentView;
            _this._def = _def;
            return _this;
        }

        /**
         * @param {?} context
         * @return {?}
         */
        TemplateRef_.prototype.createEmbeddedView = /**
         * @param {?} context
         * @return {?}
         */
        function (context) {
            return new ViewRef_(Services.createEmbeddedView(this._parentView, this._def, /** @type {?} */ ((((this._def.element)).template)), context));
        };
        Object.defineProperty(TemplateRef_.prototype, "elementRef", {
            get: /**
             * @return {?}
             */ function () {
                return new ElementRef(asElementData(this._parentView, this._def.nodeIndex).renderElement);
            },
            enumerable: true,
            configurable: true
        });
        return TemplateRef_;
    }(TemplateRef));

    /**
     * @param {?} view
     * @param {?} elDef
     * @return {?}
     */
    function createInjector(view, elDef) {
        return new Injector_(view, elDef);
    }

    var Injector_ = /*@__PURE__*/ (/*@__PURE__*/ function () {
        function Injector_(view, elDef) {
            this.view = view;
            this.elDef = elDef;
        }

        /**
         * @param {?} token
         * @param {?=} notFoundValue
         * @return {?}
         */
        Injector_.prototype.get = /**
         * @param {?} token
         * @param {?=} notFoundValue
         * @return {?}
         */
        function (token, notFoundValue) {
            if (notFoundValue === void 0) {
                notFoundValue = Injector.THROW_IF_NOT_FOUND;
            }
            var /** @type {?} */ allowPrivateServices = this.elDef ? (this.elDef.flags & 33554432 /* ComponentView */) !== 0 : false;
            return Services.resolveDep(this.view, this.elDef, allowPrivateServices, {
                flags: 0 /* None */,
                token: token,
                tokenKey: tokenKey(token)
            }, notFoundValue);
        };
        return Injector_;
    }());

    /**
     * @param {?} view
     * @return {?}
     */
    function createRendererV1(view) {
        return new RendererAdapter(view.renderer);
    }

    var RendererAdapter = /*@__PURE__*/ (/*@__PURE__*/ function () {
        function RendererAdapter(delegate) {
            this.delegate = delegate;
        }

        /**
         * @param {?} selectorOrNode
         * @return {?}
         */
        RendererAdapter.prototype.selectRootElement = /**
         * @param {?} selectorOrNode
         * @return {?}
         */
        function (selectorOrNode) {
            return this.delegate.selectRootElement(selectorOrNode);
        };
        /**
         * @param {?} parent
         * @param {?} namespaceAndName
         * @return {?}
         */
        RendererAdapter.prototype.createElement = /**
         * @param {?} parent
         * @param {?} namespaceAndName
         * @return {?}
         */
        function (parent, namespaceAndName) {
            var _a = splitNamespace(namespaceAndName), ns = _a[0], name = _a[1];
            var /** @type {?} */ el = this.delegate.createElement(name, ns);
            if (parent) {
                this.delegate.appendChild(parent, el);
            }
            return el;
        };
        /**
         * @param {?} hostElement
         * @return {?}
         */
        RendererAdapter.prototype.createViewRoot = /**
         * @param {?} hostElement
         * @return {?}
         */
        function (hostElement) {
            return hostElement;
        };
        /**
         * @param {?} parentElement
         * @return {?}
         */
        RendererAdapter.prototype.createTemplateAnchor = /**
         * @param {?} parentElement
         * @return {?}
         */
        function (parentElement) {
            var /** @type {?} */ comment = this.delegate.createComment('');
            if (parentElement) {
                this.delegate.appendChild(parentElement, comment);
            }
            return comment;
        };
        /**
         * @param {?} parentElement
         * @param {?} value
         * @return {?}
         */
        RendererAdapter.prototype.createText = /**
         * @param {?} parentElement
         * @param {?} value
         * @return {?}
         */
        function (parentElement, value) {
            var /** @type {?} */ node = this.delegate.createText(value);
            if (parentElement) {
                this.delegate.appendChild(parentElement, node);
            }
            return node;
        };
        /**
         * @param {?} parentElement
         * @param {?} nodes
         * @return {?}
         */
        RendererAdapter.prototype.projectNodes = /**
         * @param {?} parentElement
         * @param {?} nodes
         * @return {?}
         */
        function (parentElement, nodes) {
            for (var /** @type {?} */ i = 0; i < nodes.length; i++) {
                this.delegate.appendChild(parentElement, nodes[i]);
            }
        };
        /**
         * @param {?} node
         * @param {?} viewRootNodes
         * @return {?}
         */
        RendererAdapter.prototype.attachViewAfter = /**
         * @param {?} node
         * @param {?} viewRootNodes
         * @return {?}
         */
        function (node, viewRootNodes) {
            var /** @type {?} */ parentElement = this.delegate.parentNode(node);
            var /** @type {?} */ nextSibling = this.delegate.nextSibling(node);
            for (var /** @type {?} */ i = 0; i < viewRootNodes.length; i++) {
                this.delegate.insertBefore(parentElement, viewRootNodes[i], nextSibling);
            }
        };
        /**
         * @param {?} viewRootNodes
         * @return {?}
         */
        RendererAdapter.prototype.detachView = /**
         * @param {?} viewRootNodes
         * @return {?}
         */
        function (viewRootNodes) {
            for (var /** @type {?} */ i = 0; i < viewRootNodes.length; i++) {
                var /** @type {?} */ node = viewRootNodes[i];
                var /** @type {?} */ parentElement = this.delegate.parentNode(node);
                this.delegate.removeChild(parentElement, node);
            }
        };
        /**
         * @param {?} hostElement
         * @param {?} viewAllNodes
         * @return {?}
         */
        RendererAdapter.prototype.destroyView = /**
         * @param {?} hostElement
         * @param {?} viewAllNodes
         * @return {?}
         */
        function (hostElement, viewAllNodes) {
            for (var /** @type {?} */ i = 0; i < viewAllNodes.length; i++) {
                /** @type {?} */ ((this.delegate.destroyNode))(viewAllNodes[i]);
            }
        };
        /**
         * @param {?} renderElement
         * @param {?} name
         * @param {?} callback
         * @return {?}
         */
        RendererAdapter.prototype.listen = /**
         * @param {?} renderElement
         * @param {?} name
         * @param {?} callback
         * @return {?}
         */
        function (renderElement, name, callback) {
            return this.delegate.listen(renderElement, name, /** @type {?} */ (callback));
        };
        /**
         * @param {?} target
         * @param {?} name
         * @param {?} callback
         * @return {?}
         */
        RendererAdapter.prototype.listenGlobal = /**
         * @param {?} target
         * @param {?} name
         * @param {?} callback
         * @return {?}
         */
        function (target, name, callback) {
            return this.delegate.listen(target, name, /** @type {?} */ (callback));
        };
        /**
         * @param {?} renderElement
         * @param {?} propertyName
         * @param {?} propertyValue
         * @return {?}
         */
        RendererAdapter.prototype.setElementProperty = /**
         * @param {?} renderElement
         * @param {?} propertyName
         * @param {?} propertyValue
         * @return {?}
         */
        function (renderElement, propertyName, propertyValue) {
            this.delegate.setProperty(renderElement, propertyName, propertyValue);
        };
        /**
         * @param {?} renderElement
         * @param {?} namespaceAndName
         * @param {?} attributeValue
         * @return {?}
         */
        RendererAdapter.prototype.setElementAttribute = /**
         * @param {?} renderElement
         * @param {?} namespaceAndName
         * @param {?} attributeValue
         * @return {?}
         */
        function (renderElement, namespaceAndName, attributeValue) {
            var _a = splitNamespace(namespaceAndName), ns = _a[0], name = _a[1];
            if (attributeValue != null) {
                this.delegate.setAttribute(renderElement, name, attributeValue, ns);
            }
            else {
                this.delegate.removeAttribute(renderElement, name, ns);
            }
        };
        /**
         * @param {?} renderElement
         * @param {?} propertyName
         * @param {?} propertyValue
         * @return {?}
         */
        RendererAdapter.prototype.setBindingDebugInfo = /**
         * @param {?} renderElement
         * @param {?} propertyName
         * @param {?} propertyValue
         * @return {?}
         */
        function (renderElement, propertyName, propertyValue) {
        };
        /**
         * @param {?} renderElement
         * @param {?} className
         * @param {?} isAdd
         * @return {?}
         */
        RendererAdapter.prototype.setElementClass = /**
         * @param {?} renderElement
         * @param {?} className
         * @param {?} isAdd
         * @return {?}
         */
        function (renderElement, className, isAdd) {
            if (isAdd) {
                this.delegate.addClass(renderElement, className);
            }
            else {
                this.delegate.removeClass(renderElement, className);
            }
        };
        /**
         * @param {?} renderElement
         * @param {?} styleName
         * @param {?} styleValue
         * @return {?}
         */
        RendererAdapter.prototype.setElementStyle = /**
         * @param {?} renderElement
         * @param {?} styleName
         * @param {?} styleValue
         * @return {?}
         */
        function (renderElement, styleName, styleValue) {
            if (styleValue != null) {
                this.delegate.setStyle(renderElement, styleName, styleValue);
            }
            else {
                this.delegate.removeStyle(renderElement, styleName);
            }
        };
        /**
         * @param {?} renderElement
         * @param {?} methodName
         * @param {?} args
         * @return {?}
         */
        RendererAdapter.prototype.invokeElementMethod = /**
         * @param {?} renderElement
         * @param {?} methodName
         * @param {?} args
         * @return {?}
         */
        function (renderElement, methodName, args) {
            ((renderElement))[methodName].apply(renderElement, args);
        };
        /**
         * @param {?} renderNode
         * @param {?} text
         * @return {?}
         */
        RendererAdapter.prototype.setText = /**
         * @param {?} renderNode
         * @param {?} text
         * @return {?}
         */
        function (renderNode$$1, text) {
            this.delegate.setValue(renderNode$$1, text);
        };
        /**
         * @return {?}
         */
        RendererAdapter.prototype.animate = /**
         * @return {?}
         */
        function () {
            throw new Error('Renderer.animate is no longer supported!');
        };
        return RendererAdapter;
    }());

    /**
     * @param {?} moduleType
     * @param {?} parent
     * @param {?} bootstrapComponents
     * @param {?} def
     * @return {?}
     */
    function createNgModuleRef(moduleType, parent, bootstrapComponents, def) {
        return new NgModuleRef_(moduleType, parent, bootstrapComponents, def);
    }

    var NgModuleRef_ = /*@__PURE__*/ (/*@__PURE__*/ function () {
        function NgModuleRef_(_moduleType, _parent, _bootstrapComponents, _def) {
            this._moduleType = _moduleType;
            this._parent = _parent;
            this._bootstrapComponents = _bootstrapComponents;
            this._def = _def;
            this._destroyListeners = [];
            this._destroyed = false;
            this.injector = this;
            initNgModule(this);
        }

        /**
         * @param {?} token
         * @param {?=} notFoundValue
         * @return {?}
         */
        NgModuleRef_.prototype.get = /**
         * @param {?} token
         * @param {?=} notFoundValue
         * @return {?}
         */
        function (token, notFoundValue) {
            if (notFoundValue === void 0) {
                notFoundValue = Injector.THROW_IF_NOT_FOUND;
            }
            return resolveNgModuleDep(this, {
                token: token,
                tokenKey: tokenKey(token),
                flags: 0 /* None */
            }, notFoundValue);
        };
        Object.defineProperty(NgModuleRef_.prototype, "instance", {
            get: /**
             * @return {?}
             */ function () {
                return this.get(this._moduleType);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NgModuleRef_.prototype, "componentFactoryResolver", {
            get: /**
             * @return {?}
             */ function () {
                return this.get(ComponentFactoryResolver);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @return {?}
         */
        NgModuleRef_.prototype.destroy = /**
         * @return {?}
         */
        function () {
            if (this._destroyed) {
                throw new Error("The ng module " + stringify(this.instance.constructor) + " has already been destroyed.");
            }
            this._destroyed = true;
            callNgModuleLifecycle(this, 131072 /* OnDestroy */);
            this._destroyListeners.forEach(function (listener) {
                return listener();
            });
        };
        /**
         * @param {?} callback
         * @return {?}
         */
        NgModuleRef_.prototype.onDestroy = /**
         * @param {?} callback
         * @return {?}
         */
        function (callback) {
            this._destroyListeners.push(callback);
        };
        return NgModuleRef_;
    }());
    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var RendererV1TokenKey = /*@__PURE__*/ tokenKey(Renderer);
    var Renderer2TokenKey = /*@__PURE__*/ tokenKey(Renderer2);
    var ElementRefTokenKey = /*@__PURE__*/ tokenKey(ElementRef);
    var ViewContainerRefTokenKey = /*@__PURE__*/ tokenKey(ViewContainerRef);
    var TemplateRefTokenKey = /*@__PURE__*/ tokenKey(TemplateRef);
    var ChangeDetectorRefTokenKey = /*@__PURE__*/ tokenKey(ChangeDetectorRef);
    var InjectorRefTokenKey = /*@__PURE__*/ tokenKey(Injector);

    /**
     * @param {?} view
     * @param {?} def
     * @return {?}
     */
    function createProviderInstance(view, def) {
        return _createProviderInstance(view, def);
    }

    /**
     * @param {?} view
     * @param {?} def
     * @return {?}
     */
    function createPipeInstance(view, def) {
        // deps are looked up from component.
        var /** @type {?} */ compView = view;
        while (compView.parent && !isComponentView(compView)) {
            compView = compView.parent;
        }
        // pipes can see the private services of the component
        var /** @type {?} */ allowPrivateServices = true;
        // pipes are always eager and classes!
        return createClass(/** @type {?} */ ((compView.parent)), /** @type {?} */ ((viewParentEl(compView))), allowPrivateServices, /** @type {?} */ ((def.provider)).value, /** @type {?} */ ((def.provider)).deps);
    }

    /**
     * @param {?} view
     * @param {?} def
     * @return {?}
     */
    function createDirectiveInstance(view, def) {
        // components can see other private services, other directives can't.
        var /** @type {?} */ allowPrivateServices = (def.flags & 32768 /* Component */) > 0;
        // directives are always eager and classes!
        var /** @type {?} */ instance = createClass(view, /** @type {?} */ ((def.parent)), allowPrivateServices, /** @type {?} */ ((def.provider)).value, /** @type {?} */ ((def.provider)).deps);
        if (def.outputs.length) {
            for (var /** @type {?} */ i = 0; i < def.outputs.length; i++) {
                var /** @type {?} */ output = def.outputs[i];
                var /** @type {?} */ subscription = instance[((output.propName))].subscribe(eventHandlerClosure(view, /** @type {?} */ ((def.parent)).nodeIndex, output.eventName));
                /** @type {?} */
                ((view.disposables))[def.outputIndex + i] = subscription.unsubscribe.bind(subscription);
            }
        }
        return instance;
    }

    /**
     * @param {?} view
     * @param {?} index
     * @param {?} eventName
     * @return {?}
     */
    function eventHandlerClosure(view, index, eventName) {
        return function (event) {
            return dispatchEvent(view, index, eventName, event);
        };
    }

    /**
     * @param {?} view
     * @param {?} def
     * @param {?} v0
     * @param {?} v1
     * @param {?} v2
     * @param {?} v3
     * @param {?} v4
     * @param {?} v5
     * @param {?} v6
     * @param {?} v7
     * @param {?} v8
     * @param {?} v9
     * @return {?}
     */
    function checkAndUpdateDirectiveInline(view, def, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9) {
        var /** @type {?} */ providerData = asProviderData(view, def.nodeIndex);
        var /** @type {?} */ directive = providerData.instance;
        var /** @type {?} */ changed = false;
        var /** @type {?} */ changes = ((undefined));
        var /** @type {?} */ bindLen = def.bindings.length;
        if (bindLen > 0 && checkBinding(view, def, 0, v0)) {
            changed = true;
            changes = updateProp(view, providerData, def, 0, v0, changes);
        }
        if (bindLen > 1 && checkBinding(view, def, 1, v1)) {
            changed = true;
            changes = updateProp(view, providerData, def, 1, v1, changes);
        }
        if (bindLen > 2 && checkBinding(view, def, 2, v2)) {
            changed = true;
            changes = updateProp(view, providerData, def, 2, v2, changes);
        }
        if (bindLen > 3 && checkBinding(view, def, 3, v3)) {
            changed = true;
            changes = updateProp(view, providerData, def, 3, v3, changes);
        }
        if (bindLen > 4 && checkBinding(view, def, 4, v4)) {
            changed = true;
            changes = updateProp(view, providerData, def, 4, v4, changes);
        }
        if (bindLen > 5 && checkBinding(view, def, 5, v5)) {
            changed = true;
            changes = updateProp(view, providerData, def, 5, v5, changes);
        }
        if (bindLen > 6 && checkBinding(view, def, 6, v6)) {
            changed = true;
            changes = updateProp(view, providerData, def, 6, v6, changes);
        }
        if (bindLen > 7 && checkBinding(view, def, 7, v7)) {
            changed = true;
            changes = updateProp(view, providerData, def, 7, v7, changes);
        }
        if (bindLen > 8 && checkBinding(view, def, 8, v8)) {
            changed = true;
            changes = updateProp(view, providerData, def, 8, v8, changes);
        }
        if (bindLen > 9 && checkBinding(view, def, 9, v9)) {
            changed = true;
            changes = updateProp(view, providerData, def, 9, v9, changes);
        }
        if (changes) {
            directive.ngOnChanges(changes);
        }
        if ((def.flags & 65536 /* OnInit */) &&
            shouldCallLifecycleInitHook(view, 256 /* InitState_CallingOnInit */, def.nodeIndex)) {
            directive.ngOnInit();
        }
        if (def.flags & 262144 /* DoCheck */) {
            directive.ngDoCheck();
        }
        return changed;
    }

    /**
     * @param {?} view
     * @param {?} def
     * @param {?} values
     * @return {?}
     */
    function checkAndUpdateDirectiveDynamic(view, def, values) {
        var /** @type {?} */ providerData = asProviderData(view, def.nodeIndex);
        var /** @type {?} */ directive = providerData.instance;
        var /** @type {?} */ changed = false;
        var /** @type {?} */ changes = ((undefined));
        for (var /** @type {?} */ i = 0; i < values.length; i++) {
            if (checkBinding(view, def, i, values[i])) {
                changed = true;
                changes = updateProp(view, providerData, def, i, values[i], changes);
            }
        }
        if (changes) {
            directive.ngOnChanges(changes);
        }
        if ((def.flags & 65536 /* OnInit */) &&
            shouldCallLifecycleInitHook(view, 256 /* InitState_CallingOnInit */, def.nodeIndex)) {
            directive.ngOnInit();
        }
        if (def.flags & 262144 /* DoCheck */) {
            directive.ngDoCheck();
        }
        return changed;
    }

    /**
     * @param {?} view
     * @param {?} def
     * @return {?}
     */
    function _createProviderInstance(view, def) {
        // private services can see other private services
        var /** @type {?} */ allowPrivateServices = (def.flags & 8192 /* PrivateProvider */) > 0;
        var /** @type {?} */ providerDef = def.provider;
        switch (def.flags & 201347067 /* Types */) {
            case 512 /* TypeClassProvider */
            :
                return createClass(view, /** @type {?} */ ((def.parent)), allowPrivateServices, /** @type {?} */ ((providerDef)).value, /** @type {?} */ ((providerDef)).deps);
            case 1024 /* TypeFactoryProvider */
            :
                return callFactory(view, /** @type {?} */ ((def.parent)), allowPrivateServices, /** @type {?} */ ((providerDef)).value, /** @type {?} */ ((providerDef)).deps);
            case 2048 /* TypeUseExistingProvider */
            :
                return resolveDep(view, /** @type {?} */ ((def.parent)), allowPrivateServices, /** @type {?} */ ((providerDef)).deps[0]);
            case 256 /* TypeValueProvider */
            :
                return /** @type {?} */ ((providerDef)).value;
        }
    }

    /**
     * @param {?} view
     * @param {?} elDef
     * @param {?} allowPrivateServices
     * @param {?} ctor
     * @param {?} deps
     * @return {?}
     */
    function createClass(view, elDef, allowPrivateServices, ctor, deps) {
        var /** @type {?} */ len = deps.length;
        switch (len) {
            case 0:
                return new ctor();
            case 1:
                return new ctor(resolveDep(view, elDef, allowPrivateServices, deps[0]));
            case 2:
                return new ctor(resolveDep(view, elDef, allowPrivateServices, deps[0]), resolveDep(view, elDef, allowPrivateServices, deps[1]));
            case 3:
                return new ctor(resolveDep(view, elDef, allowPrivateServices, deps[0]), resolveDep(view, elDef, allowPrivateServices, deps[1]), resolveDep(view, elDef, allowPrivateServices, deps[2]));
            default:
                var /** @type {?} */ depValues = new Array(len);
                for (var /** @type {?} */ i = 0; i < len; i++) {
                    depValues[i] = resolveDep(view, elDef, allowPrivateServices, deps[i]);
                }
                return new (ctor.bind.apply(ctor, [void 0].concat(depValues)))();
        }
    }

    /**
     * @param {?} view
     * @param {?} elDef
     * @param {?} allowPrivateServices
     * @param {?} factory
     * @param {?} deps
     * @return {?}
     */
    function callFactory(view, elDef, allowPrivateServices, factory, deps) {
        var /** @type {?} */ len = deps.length;
        switch (len) {
            case 0:
                return factory();
            case 1:
                return factory(resolveDep(view, elDef, allowPrivateServices, deps[0]));
            case 2:
                return factory(resolveDep(view, elDef, allowPrivateServices, deps[0]), resolveDep(view, elDef, allowPrivateServices, deps[1]));
            case 3:
                return factory(resolveDep(view, elDef, allowPrivateServices, deps[0]), resolveDep(view, elDef, allowPrivateServices, deps[1]), resolveDep(view, elDef, allowPrivateServices, deps[2]));
            default:
                var /** @type {?} */ depValues = Array(len);
                for (var /** @type {?} */ i = 0; i < len; i++) {
                    depValues[i] = resolveDep(view, elDef, allowPrivateServices, deps[i]);
                }
                return factory.apply(void 0, depValues);
        }
    }

// This default value is when checking the hierarchy for a token.
//
// It means both:
// - the token is not provided by the current injector,
// - only the element injectors should be checked (ie do not check module injectors
//
//          mod1
//         /
//       el1   mod2
//         \  /
//         el2
//
// When requesting el2.injector.get(token), we should check in the following order and return the
// first found value:
// - el2.injector.get(token, default)
// - el1.injector.get(token, NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR) -> do not check the module
// - mod2.injector.get(token, default)
    var NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR = {};

    /**
     * @param {?} view
     * @param {?} elDef
     * @param {?} allowPrivateServices
     * @param {?} depDef
     * @param {?=} notFoundValue
     * @return {?}
     */
    function resolveDep(view, elDef, allowPrivateServices, depDef, notFoundValue) {
        if (notFoundValue === void 0) {
            notFoundValue = Injector.THROW_IF_NOT_FOUND;
        }
        if (depDef.flags & 8 /* Value */) {
            return depDef.token;
        }
        var /** @type {?} */ startView = view;
        if (depDef.flags & 2 /* Optional */) {
            notFoundValue = null;
        }
        var /** @type {?} */ tokenKey$$1 = depDef.tokenKey;
        if (tokenKey$$1 === ChangeDetectorRefTokenKey) {
            // directives on the same element as a component should be able to control the change detector
            // of that component as well.
            allowPrivateServices = !!(elDef && /** @type {?} */ ((elDef.element)).componentView);
        }
        if (elDef && (depDef.flags & 1 /* SkipSelf */)) {
            allowPrivateServices = false;
            elDef = /** @type {?} */ ((elDef.parent));
        }
        while (view) {
            if (elDef) {
                switch (tokenKey$$1) {
                    case RendererV1TokenKey: {
                        var /** @type {?} */ compView = findCompView(view, elDef, allowPrivateServices);
                        return createRendererV1(compView);
                    }
                    case Renderer2TokenKey: {
                        var /** @type {?} */ compView = findCompView(view, elDef, allowPrivateServices);
                        return compView.renderer;
                    }
                    case ElementRefTokenKey:
                        return new ElementRef(asElementData(view, elDef.nodeIndex).renderElement);
                    case ViewContainerRefTokenKey:
                        return asElementData(view, elDef.nodeIndex).viewContainer;
                    case TemplateRefTokenKey: {
                        if (((elDef.element)).template) {
                            return asElementData(view, elDef.nodeIndex).template;
                        }
                        break;
                    }
                    case ChangeDetectorRefTokenKey: {
                        var /** @type {?} */ cdView = findCompView(view, elDef, allowPrivateServices);
                        return createChangeDetectorRef(cdView);
                    }
                    case InjectorRefTokenKey:
                        return createInjector(view, elDef);
                    default:
                        var /** @type {?} */ providerDef_1 = (((allowPrivateServices ? /** @type {?} */ ((elDef.element)).allProviders : /** @type {?} */ ((elDef.element)).publicProviders)))[tokenKey$$1];
                        if (providerDef_1) {
                            var /** @type {?} */ providerData = asProviderData(view, providerDef_1.nodeIndex);
                            if (!providerData) {
                                providerData = {instance: _createProviderInstance(view, providerDef_1)};
                                view.nodes[providerDef_1.nodeIndex] = /** @type {?} */ (providerData);
                            }
                            return providerData.instance;
                        }
                }
            }
            allowPrivateServices = isComponentView(view);
            elDef = /** @type {?} */ ((viewParentEl(view)));
            view = /** @type {?} */ ((view.parent));
        }
        var /** @type {?} */ value = startView.root.injector.get(depDef.token, NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR);
        if (value !== NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR ||
            notFoundValue === NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR) {
            // Return the value from the root element injector when
            // - it provides it
            //   (value !== NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR)
            // - the module injector should not be checked
            //   (notFoundValue === NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR)
            return value;
        }
        return startView.root.ngModule.injector.get(depDef.token, notFoundValue);
    }

    /**
     * @param {?} view
     * @param {?} elDef
     * @param {?} allowPrivateServices
     * @return {?}
     */
    function findCompView(view, elDef, allowPrivateServices) {
        var /** @type {?} */ compView;
        if (allowPrivateServices) {
            compView = asElementData(view, elDef.nodeIndex).componentView;
        }
        else {
            compView = view;
            while (compView.parent && !isComponentView(compView)) {
                compView = compView.parent;
            }
        }
        return compView;
    }

    /**
     * @param {?} view
     * @param {?} providerData
     * @param {?} def
     * @param {?} bindingIdx
     * @param {?} value
     * @param {?} changes
     * @return {?}
     */
    function updateProp(view, providerData, def, bindingIdx, value, changes) {
        if (def.flags & 32768 /* Component */) {
            var /** @type {?} */ compView = asElementData(view, /** @type {?} */ ((def.parent)).nodeIndex).componentView;
            if (compView.def.flags & 2 /* OnPush */) {
                compView.state |= 8 /* ChecksEnabled */;
            }
        }
        var /** @type {?} */ binding = def.bindings[bindingIdx];
        var /** @type {?} */ propName = ((binding.name));
        // Note: This is still safe with Closure Compiler as
        // the user passed in the property name as an object has to `providerDef`,
        // so Closure Compiler will have renamed the property correctly already.
        providerData.instance[propName] = value;
        if (def.flags & 524288 /* OnChanges */) {
            changes = changes || {};
            var /** @type {?} */ oldValue = WrappedValue.unwrap(view.oldValues[def.bindingIndex + bindingIdx]);
            var /** @type {?} */ binding_1 = def.bindings[bindingIdx];
            changes[((binding_1.nonMinifiedName))] =
                new SimpleChange(oldValue, value, (view.state & 2 /* FirstCheck */) !== 0);
        }
        view.oldValues[def.bindingIndex + bindingIdx] = value;
        return changes;
    }

    /**
     * @param {?} view
     * @param {?} lifecycles
     * @return {?}
     */
    function callLifecycleHooksChildrenFirst(view, lifecycles) {
        if (!(view.def.nodeFlags & lifecycles)) {
            return;
        }
        var /** @type {?} */ nodes = view.def.nodes;
        var /** @type {?} */ initIndex = 0;
        for (var /** @type {?} */ i = 0; i < nodes.length; i++) {
            var /** @type {?} */ nodeDef = nodes[i];
            var /** @type {?} */ parent_1 = nodeDef.parent;
            if (!parent_1 && nodeDef.flags & lifecycles) {
                // matching root node (e.g. a pipe)
                callProviderLifecycles(view, i, nodeDef.flags & lifecycles, initIndex++);
            }
            if ((nodeDef.childFlags & lifecycles) === 0) {
                // no child matches one of the lifecycles
                i += nodeDef.childCount;
            }
            while (parent_1 && (parent_1.flags & 1 /* TypeElement */) &&
            i === parent_1.nodeIndex + parent_1.childCount) {
                // last child of an element
                if (parent_1.directChildFlags & lifecycles) {
                    initIndex = callElementProvidersLifecycles(view, parent_1, lifecycles, initIndex);
                }
                parent_1 = parent_1.parent;
            }
        }
    }

    /**
     * @param {?} view
     * @param {?} elDef
     * @param {?} lifecycles
     * @param {?} initIndex
     * @return {?}
     */
    function callElementProvidersLifecycles(view, elDef, lifecycles, initIndex) {
        for (var /** @type {?} */ i = elDef.nodeIndex + 1; i <= elDef.nodeIndex + elDef.childCount; i++) {
            var /** @type {?} */ nodeDef = view.def.nodes[i];
            if (nodeDef.flags & lifecycles) {
                callProviderLifecycles(view, i, nodeDef.flags & lifecycles, initIndex++);
            }
            // only visit direct children
            i += nodeDef.childCount;
        }
        return initIndex;
    }

    /**
     * @param {?} view
     * @param {?} index
     * @param {?} lifecycles
     * @param {?} initIndex
     * @return {?}
     */
    function callProviderLifecycles(view, index, lifecycles, initIndex) {
        var /** @type {?} */ providerData = asProviderData(view, index);
        if (!providerData) {
            return;
        }
        var /** @type {?} */ provider = providerData.instance;
        if (!provider) {
            return;
        }
        Services.setCurrentNode(view, index);
        if (lifecycles & 1048576 /* AfterContentInit */ &&
            shouldCallLifecycleInitHook(view, 512 /* InitState_CallingAfterContentInit */, initIndex)) {
            provider.ngAfterContentInit();
        }
        if (lifecycles & 2097152 /* AfterContentChecked */) {
            provider.ngAfterContentChecked();
        }
        if (lifecycles & 4194304 /* AfterViewInit */ &&
            shouldCallLifecycleInitHook(view, 768 /* InitState_CallingAfterViewInit */, initIndex)) {
            provider.ngAfterViewInit();
        }
        if (lifecycles & 8388608 /* AfterViewChecked */) {
            provider.ngAfterViewChecked();
        }
        if (lifecycles & 131072 /* OnDestroy */) {
            provider.ngOnDestroy();
        }
    }

    /**
     * @return {?}
     */
    function createQuery() {
        return new QueryList();
    }

    /**
     * @param {?} view
     * @return {?}
     */
    function dirtyParentQueries(view) {
        var /** @type {?} */ queryIds = view.def.nodeMatchedQueries;
        while (view.parent && isEmbeddedView(view)) {
            var /** @type {?} */ tplDef = ((view.parentNodeDef));
            view = view.parent;
            // content queries
            var /** @type {?} */ end = tplDef.nodeIndex + tplDef.childCount;
            for (var /** @type {?} */ i = 0; i <= end; i++) {
                var /** @type {?} */ nodeDef = view.def.nodes[i];
                if ((nodeDef.flags & 67108864 /* TypeContentQuery */) &&
                    (nodeDef.flags & 536870912 /* DynamicQuery */) &&
                    (((nodeDef.query)).filterId & queryIds) === /** @type {?} */ ((nodeDef.query)).filterId) {
                    asQueryList(view, i).setDirty();
                }
                if ((nodeDef.flags & 1 /* TypeElement */ && i + nodeDef.childCount < tplDef.nodeIndex) ||
                    !(nodeDef.childFlags & 67108864 /* TypeContentQuery */) ||
                    !(nodeDef.childFlags & 536870912 /* DynamicQuery */)) {
                    // skip elements that don't contain the template element or no query.
                    i += nodeDef.childCount;
                }
            }
        }
        // view queries
        if (view.def.nodeFlags & 134217728 /* TypeViewQuery */) {
            for (var /** @type {?} */ i = 0; i < view.def.nodes.length; i++) {
                var /** @type {?} */ nodeDef = view.def.nodes[i];
                if ((nodeDef.flags & 134217728 /* TypeViewQuery */) && (nodeDef.flags & 536870912 /* DynamicQuery */)) {
                    asQueryList(view, i).setDirty();
                }
                // only visit the root nodes
                i += nodeDef.childCount;
            }
        }
    }

    /**
     * @param {?} view
     * @param {?} nodeDef
     * @return {?}
     */
    function checkAndUpdateQuery(view, nodeDef) {
        var /** @type {?} */ queryList = asQueryList(view, nodeDef.nodeIndex);
        if (!queryList.dirty) {
            return;
        }
        var /** @type {?} */ directiveInstance;
        var /** @type {?} */ newValues = ((undefined));
        if (nodeDef.flags & 67108864 /* TypeContentQuery */) {
            var /** @type {?} */ elementDef = ((((nodeDef.parent)).parent));
            newValues = calcQueryValues(view, elementDef.nodeIndex, elementDef.nodeIndex + elementDef.childCount, /** @type {?} */ ((nodeDef.query)), []);
            directiveInstance = asProviderData(view, /** @type {?} */ ((nodeDef.parent)).nodeIndex).instance;
        }
        else if (nodeDef.flags & 134217728 /* TypeViewQuery */) {
            newValues = calcQueryValues(view, 0, view.def.nodes.length - 1, /** @type {?} */ ((nodeDef.query)), []);
            directiveInstance = view.component;
        }
        queryList.reset(newValues);
        var /** @type {?} */ bindings = ((nodeDef.query)).bindings;
        var /** @type {?} */ notify = false;
        for (var /** @type {?} */ i = 0; i < bindings.length; i++) {
            var /** @type {?} */ binding = bindings[i];
            var /** @type {?} */ boundValue = void 0;
            switch (binding.bindingType) {
                case 0 /* First */
                :
                    boundValue = queryList.first;
                    break;
                case 1 /* All */
                :
                    boundValue = queryList;
                    notify = true;
                    break;
            }
            directiveInstance[binding.propName] = boundValue;
        }
        if (notify) {
            queryList.notifyOnChanges();
        }
    }

    /**
     * @param {?} view
     * @param {?} startIndex
     * @param {?} endIndex
     * @param {?} queryDef
     * @param {?} values
     * @return {?}
     */
    function calcQueryValues(view, startIndex, endIndex, queryDef, values) {
        for (var /** @type {?} */ i = startIndex; i <= endIndex; i++) {
            var /** @type {?} */ nodeDef = view.def.nodes[i];
            var /** @type {?} */ valueType = nodeDef.matchedQueries[queryDef.id];
            if (valueType != null) {
                values.push(getQueryValue(view, nodeDef, valueType));
            }
            if (nodeDef.flags & 1 /* TypeElement */ && /** @type {?} */ ((nodeDef.element)).template &&
                (((((nodeDef.element)).template)).nodeMatchedQueries & queryDef.filterId) ===
                queryDef.filterId) {
                var /** @type {?} */ elementData = asElementData(view, i);
                // check embedded views that were attached at the place of their template,
                // but process child nodes first if some match the query (see issue #16568)
                if ((nodeDef.childMatchedQueries & queryDef.filterId) === queryDef.filterId) {
                    calcQueryValues(view, i + 1, i + nodeDef.childCount, queryDef, values);
                    i += nodeDef.childCount;
                }
                if (nodeDef.flags & 16777216 /* EmbeddedViews */) {
                    var /** @type {?} */ embeddedViews = ((elementData.viewContainer))._embeddedViews;
                    for (var /** @type {?} */ k = 0; k < embeddedViews.length; k++) {
                        var /** @type {?} */ embeddedView = embeddedViews[k];
                        var /** @type {?} */ dvc = declaredViewContainer(embeddedView);
                        if (dvc && dvc === elementData) {
                            calcQueryValues(embeddedView, 0, embeddedView.def.nodes.length - 1, queryDef, values);
                        }
                    }
                }
                var /** @type {?} */ projectedViews = elementData.template._projectedViews;
                if (projectedViews) {
                    for (var /** @type {?} */ k = 0; k < projectedViews.length; k++) {
                        var /** @type {?} */ projectedView = projectedViews[k];
                        calcQueryValues(projectedView, 0, projectedView.def.nodes.length - 1, queryDef, values);
                    }
                }
            }
            if ((nodeDef.childMatchedQueries & queryDef.filterId) !== queryDef.filterId) {
                // if no child matches the query, skip the children.
                i += nodeDef.childCount;
            }
        }
        return values;
    }

    /**
     * @param {?} view
     * @param {?} nodeDef
     * @param {?} queryValueType
     * @return {?}
     */
    function getQueryValue(view, nodeDef, queryValueType) {
        if (queryValueType != null) {
            // a match
            switch (queryValueType) {
                case 1 /* RenderElement */
                :
                    return asElementData(view, nodeDef.nodeIndex).renderElement;
                case 0 /* ElementRef */
                :
                    return new ElementRef(asElementData(view, nodeDef.nodeIndex).renderElement);
                case 2 /* TemplateRef */
                :
                    return asElementData(view, nodeDef.nodeIndex).template;
                case 3 /* ViewContainerRef */
                :
                    return asElementData(view, nodeDef.nodeIndex).viewContainer;
                case 4 /* Provider */
                :
                    return asProviderData(view, nodeDef.nodeIndex).instance;
            }
        }
    }

    /**
     * @param {?} view
     * @param {?} renderHost
     * @param {?} def
     * @return {?}
     */
    function appendNgContent(view, renderHost, def) {
        var /** @type {?} */ parentEl = getParentRenderElement(view, renderHost, def);
        if (!parentEl) {
            // Nothing to do if there is no parent element.
            return;
        }
        var /** @type {?} */ ngContentIndex = ((def.ngContent)).index;
        visitProjectedRenderNodes(view, ngContentIndex, 1 /* AppendChild */, parentEl, null, undefined);
    }

    /**
     * @param {?} view
     * @param {?} def
     * @return {?}
     */
    function createPureExpression(view, def) {
        return {value: undefined};
    }

    /**
     * @param {?} view
     * @param {?} def
     * @param {?} v0
     * @param {?} v1
     * @param {?} v2
     * @param {?} v3
     * @param {?} v4
     * @param {?} v5
     * @param {?} v6
     * @param {?} v7
     * @param {?} v8
     * @param {?} v9
     * @return {?}
     */
    function checkAndUpdatePureExpressionInline(view, def, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9) {
        var /** @type {?} */ bindings = def.bindings;
        var /** @type {?} */ changed = false;
        var /** @type {?} */ bindLen = bindings.length;
        if (bindLen > 0 && checkAndUpdateBinding(view, def, 0, v0))
            changed = true;
        if (bindLen > 1 && checkAndUpdateBinding(view, def, 1, v1))
            changed = true;
        if (bindLen > 2 && checkAndUpdateBinding(view, def, 2, v2))
            changed = true;
        if (bindLen > 3 && checkAndUpdateBinding(view, def, 3, v3))
            changed = true;
        if (bindLen > 4 && checkAndUpdateBinding(view, def, 4, v4))
            changed = true;
        if (bindLen > 5 && checkAndUpdateBinding(view, def, 5, v5))
            changed = true;
        if (bindLen > 6 && checkAndUpdateBinding(view, def, 6, v6))
            changed = true;
        if (bindLen > 7 && checkAndUpdateBinding(view, def, 7, v7))
            changed = true;
        if (bindLen > 8 && checkAndUpdateBinding(view, def, 8, v8))
            changed = true;
        if (bindLen > 9 && checkAndUpdateBinding(view, def, 9, v9))
            changed = true;
        if (changed) {
            var /** @type {?} */ data = asPureExpressionData(view, def.nodeIndex);
            var /** @type {?} */ value = void 0;
            switch (def.flags & 201347067 /* Types */) {
                case 32 /* TypePureArray */
                :
                    value = new Array(bindings.length);
                    if (bindLen > 0)
                        value[0] = v0;
                    if (bindLen > 1)
                        value[1] = v1;
                    if (bindLen > 2)
                        value[2] = v2;
                    if (bindLen > 3)
                        value[3] = v3;
                    if (bindLen > 4)
                        value[4] = v4;
                    if (bindLen > 5)
                        value[5] = v5;
                    if (bindLen > 6)
                        value[6] = v6;
                    if (bindLen > 7)
                        value[7] = v7;
                    if (bindLen > 8)
                        value[8] = v8;
                    if (bindLen > 9)
                        value[9] = v9;
                    break;
                case 64 /* TypePureObject */
                :
                    value = {};
                    if (bindLen > 0)
                        value[((bindings[0].name))] = v0;
                    if (bindLen > 1)
                        value[((bindings[1].name))] = v1;
                    if (bindLen > 2)
                        value[((bindings[2].name))] = v2;
                    if (bindLen > 3)
                        value[((bindings[3].name))] = v3;
                    if (bindLen > 4)
                        value[((bindings[4].name))] = v4;
                    if (bindLen > 5)
                        value[((bindings[5].name))] = v5;
                    if (bindLen > 6)
                        value[((bindings[6].name))] = v6;
                    if (bindLen > 7)
                        value[((bindings[7].name))] = v7;
                    if (bindLen > 8)
                        value[((bindings[8].name))] = v8;
                    if (bindLen > 9)
                        value[((bindings[9].name))] = v9;
                    break;
                case 128 /* TypePurePipe */
                :
                    var /** @type {?} */ pipe = v0;
                    switch (bindLen) {
                        case 1:
                            value = pipe.transform(v0);
                            break;
                        case 2:
                            value = pipe.transform(v1);
                            break;
                        case 3:
                            value = pipe.transform(v1, v2);
                            break;
                        case 4:
                            value = pipe.transform(v1, v2, v3);
                            break;
                        case 5:
                            value = pipe.transform(v1, v2, v3, v4);
                            break;
                        case 6:
                            value = pipe.transform(v1, v2, v3, v4, v5);
                            break;
                        case 7:
                            value = pipe.transform(v1, v2, v3, v4, v5, v6);
                            break;
                        case 8:
                            value = pipe.transform(v1, v2, v3, v4, v5, v6, v7);
                            break;
                        case 9:
                            value = pipe.transform(v1, v2, v3, v4, v5, v6, v7, v8);
                            break;
                        case 10:
                            value = pipe.transform(v1, v2, v3, v4, v5, v6, v7, v8, v9);
                            break;
                    }
                    break;
            }
            data.value = value;
        }
        return changed;
    }

    /**
     * @param {?} view
     * @param {?} def
     * @param {?} values
     * @return {?}
     */
    function checkAndUpdatePureExpressionDynamic(view, def, values) {
        var /** @type {?} */ bindings = def.bindings;
        var /** @type {?} */ changed = false;
        for (var /** @type {?} */ i = 0; i < values.length; i++) {
            // Note: We need to loop over all values, so that
            // the old values are updates as well!
            if (checkAndUpdateBinding(view, def, i, values[i])) {
                changed = true;
            }
        }
        if (changed) {
            var /** @type {?} */ data = asPureExpressionData(view, def.nodeIndex);
            var /** @type {?} */ value = void 0;
            switch (def.flags & 201347067 /* Types */) {
                case 32 /* TypePureArray */
                :
                    value = values;
                    break;
                case 64 /* TypePureObject */
                :
                    value = {};
                    for (var /** @type {?} */ i = 0; i < values.length; i++) {
                        value[((bindings[i].name))] = values[i];
                    }
                    break;
                case 128 /* TypePurePipe */
                :
                    var /** @type {?} */ pipe = values[0];
                    var /** @type {?} */ params = values.slice(1);
                    value = pipe.transform.apply(pipe, params);
                    break;
            }
            data.value = value;
        }
        return changed;
    }

    /**
     * @param {?} view
     * @param {?} renderHost
     * @param {?} def
     * @return {?}
     */
    function createText(view, renderHost, def) {
        var /** @type {?} */ renderNode$$1;
        var /** @type {?} */ renderer = view.renderer;
        renderNode$$1 = renderer.createText(/** @type {?} */ ((def.text)).prefix);
        var /** @type {?} */ parentEl = getParentRenderElement(view, renderHost, def);
        if (parentEl) {
            renderer.appendChild(parentEl, renderNode$$1);
        }
        return {renderText: renderNode$$1};
    }

    /**
     * @param {?} view
     * @param {?} def
     * @param {?} v0
     * @param {?} v1
     * @param {?} v2
     * @param {?} v3
     * @param {?} v4
     * @param {?} v5
     * @param {?} v6
     * @param {?} v7
     * @param {?} v8
     * @param {?} v9
     * @return {?}
     */
    function checkAndUpdateTextInline(view, def, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9) {
        var /** @type {?} */ changed = false;
        var /** @type {?} */ bindings = def.bindings;
        var /** @type {?} */ bindLen = bindings.length;
        if (bindLen > 0 && checkAndUpdateBinding(view, def, 0, v0))
            changed = true;
        if (bindLen > 1 && checkAndUpdateBinding(view, def, 1, v1))
            changed = true;
        if (bindLen > 2 && checkAndUpdateBinding(view, def, 2, v2))
            changed = true;
        if (bindLen > 3 && checkAndUpdateBinding(view, def, 3, v3))
            changed = true;
        if (bindLen > 4 && checkAndUpdateBinding(view, def, 4, v4))
            changed = true;
        if (bindLen > 5 && checkAndUpdateBinding(view, def, 5, v5))
            changed = true;
        if (bindLen > 6 && checkAndUpdateBinding(view, def, 6, v6))
            changed = true;
        if (bindLen > 7 && checkAndUpdateBinding(view, def, 7, v7))
            changed = true;
        if (bindLen > 8 && checkAndUpdateBinding(view, def, 8, v8))
            changed = true;
        if (bindLen > 9 && checkAndUpdateBinding(view, def, 9, v9))
            changed = true;
        if (changed) {
            var /** @type {?} */ value = ((def.text)).prefix;
            if (bindLen > 0)
                value += _addInterpolationPart(v0, bindings[0]);
            if (bindLen > 1)
                value += _addInterpolationPart(v1, bindings[1]);
            if (bindLen > 2)
                value += _addInterpolationPart(v2, bindings[2]);
            if (bindLen > 3)
                value += _addInterpolationPart(v3, bindings[3]);
            if (bindLen > 4)
                value += _addInterpolationPart(v4, bindings[4]);
            if (bindLen > 5)
                value += _addInterpolationPart(v5, bindings[5]);
            if (bindLen > 6)
                value += _addInterpolationPart(v6, bindings[6]);
            if (bindLen > 7)
                value += _addInterpolationPart(v7, bindings[7]);
            if (bindLen > 8)
                value += _addInterpolationPart(v8, bindings[8]);
            if (bindLen > 9)
                value += _addInterpolationPart(v9, bindings[9]);
            var /** @type {?} */ renderNode$$1 = asTextData(view, def.nodeIndex).renderText;
            view.renderer.setValue(renderNode$$1, value);
        }
        return changed;
    }

    /**
     * @param {?} view
     * @param {?} def
     * @param {?} values
     * @return {?}
     */
    function checkAndUpdateTextDynamic(view, def, values) {
        var /** @type {?} */ bindings = def.bindings;
        var /** @type {?} */ changed = false;
        for (var /** @type {?} */ i = 0; i < values.length; i++) {
            // Note: We need to loop over all values, so that
            // the old values are updates as well!
            if (checkAndUpdateBinding(view, def, i, values[i])) {
                changed = true;
            }
        }
        if (changed) {
            var /** @type {?} */ value = '';
            for (var /** @type {?} */ i = 0; i < values.length; i++) {
                value = value + _addInterpolationPart(values[i], bindings[i]);
            }
            value = /** @type {?} */ ((def.text)).prefix + value;
            var /** @type {?} */ renderNode$$1 = asTextData(view, def.nodeIndex).renderText;
            view.renderer.setValue(renderNode$$1, value);
        }
        return changed;
    }

    /**
     * @param {?} value
     * @param {?} binding
     * @return {?}
     */
    function _addInterpolationPart(value, binding) {
        var /** @type {?} */ valueStr = value != null ? value.toString() : '';
        return valueStr + binding.suffix;
    }

    /**
     * @param {?} parent
     * @param {?} anchorDef
     * @param {?} viewDef
     * @param {?=} context
     * @return {?}
     */
    function createEmbeddedView(parent, anchorDef$$1, viewDef, context) {
        // embedded views are seen as siblings to the anchor, so we need
        // to get the parent of the anchor and use it as parentIndex.
        var /** @type {?} */ view = createView(parent.root, parent.renderer, parent, anchorDef$$1, viewDef);
        initView(view, parent.component, context);
        createViewNodes(view);
        return view;
    }

    /**
     * @param {?} root
     * @param {?} def
     * @param {?=} context
     * @return {?}
     */
    function createRootView(root, def, context) {
        var /** @type {?} */ view = createView(root, root.renderer, null, null, def);
        initView(view, context, context);
        createViewNodes(view);
        return view;
    }

    /**
     * @param {?} parentView
     * @param {?} nodeDef
     * @param {?} viewDef
     * @param {?} hostElement
     * @return {?}
     */
    function createComponentView(parentView, nodeDef, viewDef, hostElement) {
        var /** @type {?} */ rendererType = ((nodeDef.element)).componentRendererType;
        var /** @type {?} */ compRenderer;
        if (!rendererType) {
            compRenderer = parentView.root.renderer;
        }
        else {
            compRenderer = parentView.root.rendererFactory.createRenderer(hostElement, rendererType);
        }
        return createView(parentView.root, compRenderer, parentView, /** @type {?} */ ((nodeDef.element)).componentProvider, viewDef);
    }

    /**
     * @param {?} root
     * @param {?} renderer
     * @param {?} parent
     * @param {?} parentNodeDef
     * @param {?} def
     * @return {?}
     */
    function createView(root, renderer, parent, parentNodeDef, def) {
        var /** @type {?} */ nodes = new Array(def.nodes.length);
        var /** @type {?} */ disposables = def.outputCount ? new Array(def.outputCount) : null;
        var /** @type {?} */ view = {
            def: def,
            parent: parent,
            viewContainerParent: null, parentNodeDef: parentNodeDef,
            context: null,
            component: null, nodes: nodes,
            state: 13 /* CatInit */, root: root, renderer: renderer,
            oldValues: new Array(def.bindingCount), disposables: disposables,
            initIndex: -1
        };
        return view;
    }

    /**
     * @param {?} view
     * @param {?} component
     * @param {?} context
     * @return {?}
     */
    function initView(view, component, context) {
        view.component = component;
        view.context = context;
    }

    /**
     * @param {?} view
     * @return {?}
     */
    function createViewNodes(view) {
        var /** @type {?} */ renderHost;
        if (isComponentView(view)) {
            var /** @type {?} */ hostDef = view.parentNodeDef;
            renderHost = asElementData(/** @type {?} */ ((view.parent)), /** @type {?} */ ((((hostDef)).parent)).nodeIndex).renderElement;
        }
        var /** @type {?} */ def = view.def;
        var /** @type {?} */ nodes = view.nodes;
        for (var /** @type {?} */ i = 0; i < def.nodes.length; i++) {
            var /** @type {?} */ nodeDef = def.nodes[i];
            Services.setCurrentNode(view, i);
            var /** @type {?} */ nodeData = void 0;
            switch (nodeDef.flags & 201347067 /* Types */) {
                case 1 /* TypeElement */
                :
                    var /** @type {?} */ el = (createElement(view, renderHost, nodeDef));
                    var /** @type {?} */ componentView = ((undefined));
                    if (nodeDef.flags & 33554432 /* ComponentView */) {
                        var /** @type {?} */ compViewDef = resolveDefinition(/** @type {?} */ ((((nodeDef.element)).componentView)));
                        componentView = Services.createComponentView(view, nodeDef, compViewDef, el);
                    }
                    listenToElementOutputs(view, componentView, nodeDef, el);
                    nodeData = /** @type {?} */ ({
                        renderElement: el,
                        componentView: componentView,
                        viewContainer: null,
                        template: /** @type {?} */ ((nodeDef.element)).template ? createTemplateData(view, nodeDef) : undefined
                    });
                    if (nodeDef.flags & 16777216 /* EmbeddedViews */) {
                        nodeData.viewContainer = createViewContainerData(view, nodeDef, nodeData);
                    }
                    break;
                case 2 /* TypeText */
                :
                    nodeData = /** @type {?} */ (createText(view, renderHost, nodeDef));
                    break;
                case 512 /* TypeClassProvider */
                :
                case 1024 /* TypeFactoryProvider */
                :
                case 2048 /* TypeUseExistingProvider */
                :
                case 256 /* TypeValueProvider */
                : {
                    nodeData = nodes[i];
                    if (!nodeData && !(nodeDef.flags & 4096 /* LazyProvider */)) {
                        var /** @type {?} */ instance = createProviderInstance(view, nodeDef);
                        nodeData = /** @type {?} */ ({instance: instance});
                    }
                    break;
                }
                case 16 /* TypePipe */
                : {
                    var /** @type {?} */ instance = createPipeInstance(view, nodeDef);
                    nodeData = /** @type {?} */ ({instance: instance});
                    break;
                }
                case 16384 /* TypeDirective */
                : {
                    nodeData = nodes[i];
                    if (!nodeData) {
                        var /** @type {?} */ instance = createDirectiveInstance(view, nodeDef);
                        nodeData = /** @type {?} */ ({instance: instance});
                    }
                    if (nodeDef.flags & 32768 /* Component */) {
                        var /** @type {?} */ compView = asElementData(view, /** @type {?} */ ((nodeDef.parent)).nodeIndex).componentView;
                        initView(compView, nodeData.instance, nodeData.instance);
                    }
                    break;
                }
                case 32 /* TypePureArray */
                :
                case 64 /* TypePureObject */
                :
                case 128 /* TypePurePipe */
                :
                    nodeData = /** @type {?} */ (createPureExpression(view, nodeDef));
                    break;
                case 67108864 /* TypeContentQuery */
                :
                case 134217728 /* TypeViewQuery */
                :
                    nodeData = /** @type {?} */ (createQuery());
                    break;
                case 8 /* TypeNgContent */
                :
                    appendNgContent(view, renderHost, nodeDef);
                    // no runtime data needed for NgContent...
                    nodeData = undefined;
                    break;
            }
            nodes[i] = nodeData;
        }
        // Create the ViewData.nodes of component views after we created everything else,
        // so that e.g. ng-content works
        execComponentViewsAction(view, ViewAction.CreateViewNodes);
        // fill static content and view queries
        execQueriesAction(view, 67108864 /* TypeContentQuery */ | 134217728 /* TypeViewQuery */, 268435456 /* StaticQuery */, 0 /* CheckAndUpdate */);
    }

    /**
     * @param {?} view
     * @return {?}
     */
    function checkNoChangesView(view) {
        markProjectedViewsForCheck(view);
        Services.updateDirectives(view, 1 /* CheckNoChanges */);
        execEmbeddedViewsAction(view, ViewAction.CheckNoChanges);
        Services.updateRenderer(view, 1 /* CheckNoChanges */);
        execComponentViewsAction(view, ViewAction.CheckNoChanges);
        // Note: We don't check queries for changes as we didn't do this in v2.x.
        // TODO(tbosch): investigate if we can enable the check again in v5.x with a nicer error message.
        view.state &= ~(64 /* CheckProjectedViews */ | 32 /* CheckProjectedView */);
    }

    /**
     * @param {?} view
     * @return {?}
     */
    function checkAndUpdateView(view) {
        if (view.state & 1 /* BeforeFirstCheck */) {
            view.state &= ~1 /* BeforeFirstCheck */;
            view.state |= 2 /* FirstCheck */;
        }
        else {
            view.state &= ~2 /* FirstCheck */;
        }
        shiftInitState(view, 0 /* InitState_BeforeInit */, 256 /* InitState_CallingOnInit */);
        markProjectedViewsForCheck(view);
        Services.updateDirectives(view, 0 /* CheckAndUpdate */);
        execEmbeddedViewsAction(view, ViewAction.CheckAndUpdate);
        execQueriesAction(view, 67108864 /* TypeContentQuery */, 536870912 /* DynamicQuery */, 0 /* CheckAndUpdate */);
        var /** @type {?} */ callInit = shiftInitState(view, 256 /* InitState_CallingOnInit */, 512 /* InitState_CallingAfterContentInit */);
        callLifecycleHooksChildrenFirst(view, 2097152 /* AfterContentChecked */ | (callInit ? 1048576 /* AfterContentInit */ : 0));
        Services.updateRenderer(view, 0 /* CheckAndUpdate */);
        execComponentViewsAction(view, ViewAction.CheckAndUpdate);
        execQueriesAction(view, 134217728 /* TypeViewQuery */, 536870912 /* DynamicQuery */, 0 /* CheckAndUpdate */);
        callInit = shiftInitState(view, 512 /* InitState_CallingAfterContentInit */, 768 /* InitState_CallingAfterViewInit */);
        callLifecycleHooksChildrenFirst(view, 8388608 /* AfterViewChecked */ | (callInit ? 4194304 /* AfterViewInit */ : 0));
        if (view.def.flags & 2 /* OnPush */) {
            view.state &= ~8 /* ChecksEnabled */;
        }
        view.state &= ~(64 /* CheckProjectedViews */ | 32 /* CheckProjectedView */);
        shiftInitState(view, 768 /* InitState_CallingAfterViewInit */, 1024 /* InitState_AfterInit */);
    }

    /**
     * @param {?} view
     * @param {?} nodeDef
     * @param {?} argStyle
     * @param {?=} v0
     * @param {?=} v1
     * @param {?=} v2
     * @param {?=} v3
     * @param {?=} v4
     * @param {?=} v5
     * @param {?=} v6
     * @param {?=} v7
     * @param {?=} v8
     * @param {?=} v9
     * @return {?}
     */
    function checkAndUpdateNode(view, nodeDef, argStyle, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9) {
        if (argStyle === 0 /* Inline */) {
            return checkAndUpdateNodeInline(view, nodeDef, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9);
        }
        else {
            return checkAndUpdateNodeDynamic(view, nodeDef, v0);
        }
    }

    /**
     * @param {?} view
     * @return {?}
     */
    function markProjectedViewsForCheck(view) {
        var /** @type {?} */ def = view.def;
        if (!(def.nodeFlags & 4 /* ProjectedTemplate */)) {
            return;
        }
        for (var /** @type {?} */ i = 0; i < def.nodes.length; i++) {
            var /** @type {?} */ nodeDef = def.nodes[i];
            if (nodeDef.flags & 4 /* ProjectedTemplate */) {
                var /** @type {?} */ projectedViews = asElementData(view, i).template._projectedViews;
                if (projectedViews) {
                    for (var /** @type {?} */ i_1 = 0; i_1 < projectedViews.length; i_1++) {
                        var /** @type {?} */ projectedView = projectedViews[i_1];
                        projectedView.state |= 32 /* CheckProjectedView */;
                        markParentViewsForCheckProjectedViews(projectedView, view);
                    }
                }
            }
            else if ((nodeDef.childFlags & 4 /* ProjectedTemplate */) === 0) {
                // a parent with leafs
                // no child is a component,
                // then skip the children
                i += nodeDef.childCount;
            }
        }
    }

    /**
     * @param {?} view
     * @param {?} nodeDef
     * @param {?=} v0
     * @param {?=} v1
     * @param {?=} v2
     * @param {?=} v3
     * @param {?=} v4
     * @param {?=} v5
     * @param {?=} v6
     * @param {?=} v7
     * @param {?=} v8
     * @param {?=} v9
     * @return {?}
     */
    function checkAndUpdateNodeInline(view, nodeDef, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9) {
        switch (nodeDef.flags & 201347067 /* Types */) {
            case 1 /* TypeElement */
            :
                return checkAndUpdateElementInline(view, nodeDef, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9);
            case 2 /* TypeText */
            :
                return checkAndUpdateTextInline(view, nodeDef, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9);
            case 16384 /* TypeDirective */
            :
                return checkAndUpdateDirectiveInline(view, nodeDef, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9);
            case 32 /* TypePureArray */
            :
            case 64 /* TypePureObject */
            :
            case 128 /* TypePurePipe */
            :
                return checkAndUpdatePureExpressionInline(view, nodeDef, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9);
            default:
                throw 'unreachable';
        }
    }

    /**
     * @param {?} view
     * @param {?} nodeDef
     * @param {?} values
     * @return {?}
     */
    function checkAndUpdateNodeDynamic(view, nodeDef, values) {
        switch (nodeDef.flags & 201347067 /* Types */) {
            case 1 /* TypeElement */
            :
                return checkAndUpdateElementDynamic(view, nodeDef, values);
            case 2 /* TypeText */
            :
                return checkAndUpdateTextDynamic(view, nodeDef, values);
            case 16384 /* TypeDirective */
            :
                return checkAndUpdateDirectiveDynamic(view, nodeDef, values);
            case 32 /* TypePureArray */
            :
            case 64 /* TypePureObject */
            :
            case 128 /* TypePurePipe */
            :
                return checkAndUpdatePureExpressionDynamic(view, nodeDef, values);
            default:
                throw 'unreachable';
        }
    }

    /**
     * @param {?} view
     * @param {?} nodeDef
     * @param {?} argStyle
     * @param {?=} v0
     * @param {?=} v1
     * @param {?=} v2
     * @param {?=} v3
     * @param {?=} v4
     * @param {?=} v5
     * @param {?=} v6
     * @param {?=} v7
     * @param {?=} v8
     * @param {?=} v9
     * @return {?}
     */
    function checkNoChangesNode(view, nodeDef, argStyle, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9) {
        if (argStyle === 0 /* Inline */) {
            checkNoChangesNodeInline(view, nodeDef, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9);
        }
        else {
            checkNoChangesNodeDynamic(view, nodeDef, v0);
        }
        // Returning false is ok here as we would have thrown in case of a change.
        return false;
    }

    /**
     * @param {?} view
     * @param {?} nodeDef
     * @param {?} v0
     * @param {?} v1
     * @param {?} v2
     * @param {?} v3
     * @param {?} v4
     * @param {?} v5
     * @param {?} v6
     * @param {?} v7
     * @param {?} v8
     * @param {?} v9
     * @return {?}
     */
    function checkNoChangesNodeInline(view, nodeDef, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9) {
        var /** @type {?} */ bindLen = nodeDef.bindings.length;
        if (bindLen > 0)
            checkBindingNoChanges(view, nodeDef, 0, v0);
        if (bindLen > 1)
            checkBindingNoChanges(view, nodeDef, 1, v1);
        if (bindLen > 2)
            checkBindingNoChanges(view, nodeDef, 2, v2);
        if (bindLen > 3)
            checkBindingNoChanges(view, nodeDef, 3, v3);
        if (bindLen > 4)
            checkBindingNoChanges(view, nodeDef, 4, v4);
        if (bindLen > 5)
            checkBindingNoChanges(view, nodeDef, 5, v5);
        if (bindLen > 6)
            checkBindingNoChanges(view, nodeDef, 6, v6);
        if (bindLen > 7)
            checkBindingNoChanges(view, nodeDef, 7, v7);
        if (bindLen > 8)
            checkBindingNoChanges(view, nodeDef, 8, v8);
        if (bindLen > 9)
            checkBindingNoChanges(view, nodeDef, 9, v9);
    }

    /**
     * @param {?} view
     * @param {?} nodeDef
     * @param {?} values
     * @return {?}
     */
    function checkNoChangesNodeDynamic(view, nodeDef, values) {
        for (var /** @type {?} */ i = 0; i < values.length; i++) {
            checkBindingNoChanges(view, nodeDef, i, values[i]);
        }
    }

    /**
     * Workaround https://github.com/angular/tsickle/issues/497
     * @suppress {misplacedTypeAnnotation}
     * @param {?} view
     * @param {?} nodeDef
     * @return {?}
     */
    function checkNoChangesQuery(view, nodeDef) {
        var /** @type {?} */ queryList = asQueryList(view, nodeDef.nodeIndex);
        if (queryList.dirty) {
            throw expressionChangedAfterItHasBeenCheckedError(Services.createDebugContext(view, nodeDef.nodeIndex), "Query " + (((nodeDef.query))).id + " not dirty", "Query " + (((nodeDef.query))).id + " dirty", (view.state & 1 /* BeforeFirstCheck */) !== 0);
        }
    }

    /**
     * @param {?} view
     * @return {?}
     */
    function destroyView(view) {
        if (view.state & 128 /* Destroyed */) {
            return;
        }
        execEmbeddedViewsAction(view, ViewAction.Destroy);
        execComponentViewsAction(view, ViewAction.Destroy);
        callLifecycleHooksChildrenFirst(view, 131072 /* OnDestroy */);
        if (view.disposables) {
            for (var /** @type {?} */ i = 0; i < view.disposables.length; i++) {
                view.disposables[i]();
            }
        }
        detachProjectedView(view);
        if (view.renderer.destroyNode) {
            destroyViewNodes(view);
        }
        if (isComponentView(view)) {
            view.renderer.destroy();
        }
        view.state |= 128 /* Destroyed */;
    }

    /**
     * @param {?} view
     * @return {?}
     */
    function destroyViewNodes(view) {
        var /** @type {?} */ len = view.def.nodes.length;
        for (var /** @type {?} */ i = 0; i < len; i++) {
            var /** @type {?} */ def = view.def.nodes[i];
            if (def.flags & 1 /* TypeElement */) {
                /** @type {?} */ ((view.renderer.destroyNode))(asElementData(view, i).renderElement);
            }
            else if (def.flags & 2 /* TypeText */) {
                /** @type {?} */ ((view.renderer.destroyNode))(asTextData(view, i).renderText);
            }
            else if (def.flags & 67108864 /* TypeContentQuery */ || def.flags & 134217728 /* TypeViewQuery */) {
                asQueryList(view, i).destroy();
            }
        }
    }

    /** @enum {number} */
    var ViewAction = /*@__PURE__*/ (function () {
        var ViewAction = {
            CreateViewNodes: 0,
            CheckNoChanges: 1,
            CheckNoChangesProjectedViews: 2,
            CheckAndUpdate: 3,
            CheckAndUpdateProjectedViews: 4,
            Destroy: 5,
        };
        ViewAction[ViewAction.CreateViewNodes] = "CreateViewNodes";
        ViewAction[ViewAction.CheckNoChanges] = "CheckNoChanges";
        ViewAction[ViewAction.CheckNoChangesProjectedViews] = "CheckNoChangesProjectedViews";
        ViewAction[ViewAction.CheckAndUpdate] = "CheckAndUpdate";
        ViewAction[ViewAction.CheckAndUpdateProjectedViews] = "CheckAndUpdateProjectedViews";
        ViewAction[ViewAction.Destroy] = "Destroy";
        return ViewAction;
    })();

    /**
     * @param {?} view
     * @param {?} action
     * @return {?}
     */
    function execComponentViewsAction(view, action) {
        var /** @type {?} */ def = view.def;
        if (!(def.nodeFlags & 33554432 /* ComponentView */)) {
            return;
        }
        for (var /** @type {?} */ i = 0; i < def.nodes.length; i++) {
            var /** @type {?} */ nodeDef = def.nodes[i];
            if (nodeDef.flags & 33554432 /* ComponentView */) {
                // a leaf
                callViewAction(asElementData(view, i).componentView, action);
            }
            else if ((nodeDef.childFlags & 33554432 /* ComponentView */) === 0) {
                // a parent with leafs
                // no child is a component,
                // then skip the children
                i += nodeDef.childCount;
            }
        }
    }

    /**
     * @param {?} view
     * @param {?} action
     * @return {?}
     */
    function execEmbeddedViewsAction(view, action) {
        var /** @type {?} */ def = view.def;
        if (!(def.nodeFlags & 16777216 /* EmbeddedViews */)) {
            return;
        }
        for (var /** @type {?} */ i = 0; i < def.nodes.length; i++) {
            var /** @type {?} */ nodeDef = def.nodes[i];
            if (nodeDef.flags & 16777216 /* EmbeddedViews */) {
                // a leaf
                var /** @type {?} */ embeddedViews = ((asElementData(view, i).viewContainer))._embeddedViews;
                for (var /** @type {?} */ k = 0; k < embeddedViews.length; k++) {
                    callViewAction(embeddedViews[k], action);
                }
            }
            else if ((nodeDef.childFlags & 16777216 /* EmbeddedViews */) === 0) {
                // a parent with leafs
                // no child is a component,
                // then skip the children
                i += nodeDef.childCount;
            }
        }
    }

    /**
     * @param {?} view
     * @param {?} action
     * @return {?}
     */
    function callViewAction(view, action) {
        var /** @type {?} */ viewState = view.state;
        switch (action) {
            case ViewAction.CheckNoChanges:
                if ((viewState & 128 /* Destroyed */) === 0) {
                    if ((viewState & 12 /* CatDetectChanges */) === 12 /* CatDetectChanges */) {
                        checkNoChangesView(view);
                    }
                    else if (viewState & 64 /* CheckProjectedViews */) {
                        execProjectedViewsAction(view, ViewAction.CheckNoChangesProjectedViews);
                    }
                }
                break;
            case ViewAction.CheckNoChangesProjectedViews:
                if ((viewState & 128 /* Destroyed */) === 0) {
                    if (viewState & 32 /* CheckProjectedView */) {
                        checkNoChangesView(view);
                    }
                    else if (viewState & 64 /* CheckProjectedViews */) {
                        execProjectedViewsAction(view, action);
                    }
                }
                break;
            case ViewAction.CheckAndUpdate:
                if ((viewState & 128 /* Destroyed */) === 0) {
                    if ((viewState & 12 /* CatDetectChanges */) === 12 /* CatDetectChanges */) {
                        checkAndUpdateView(view);
                    }
                    else if (viewState & 64 /* CheckProjectedViews */) {
                        execProjectedViewsAction(view, ViewAction.CheckAndUpdateProjectedViews);
                    }
                }
                break;
            case ViewAction.CheckAndUpdateProjectedViews:
                if ((viewState & 128 /* Destroyed */) === 0) {
                    if (viewState & 32 /* CheckProjectedView */) {
                        checkAndUpdateView(view);
                    }
                    else if (viewState & 64 /* CheckProjectedViews */) {
                        execProjectedViewsAction(view, action);
                    }
                }
                break;
            case ViewAction.Destroy:
                // Note: destroyView recurses over all views,
                // so we don't need to special case projected views here.
                destroyView(view);
                break;
            case ViewAction.CreateViewNodes:
                createViewNodes(view);
                break;
        }
    }

    /**
     * @param {?} view
     * @param {?} action
     * @return {?}
     */
    function execProjectedViewsAction(view, action) {
        execEmbeddedViewsAction(view, action);
        execComponentViewsAction(view, action);
    }

    /**
     * @param {?} view
     * @param {?} queryFlags
     * @param {?} staticDynamicQueryFlag
     * @param {?} checkType
     * @return {?}
     */
    function execQueriesAction(view, queryFlags, staticDynamicQueryFlag, checkType) {
        if (!(view.def.nodeFlags & queryFlags) || !(view.def.nodeFlags & staticDynamicQueryFlag)) {
            return;
        }
        var /** @type {?} */ nodeCount = view.def.nodes.length;
        for (var /** @type {?} */ i = 0; i < nodeCount; i++) {
            var /** @type {?} */ nodeDef = view.def.nodes[i];
            if ((nodeDef.flags & queryFlags) && (nodeDef.flags & staticDynamicQueryFlag)) {
                Services.setCurrentNode(view, nodeDef.nodeIndex);
                switch (checkType) {
                    case 0 /* CheckAndUpdate */
                    :
                        checkAndUpdateQuery(view, nodeDef);
                        break;
                    case 1 /* CheckNoChanges */
                    :
                        checkNoChangesQuery(view, nodeDef);
                        break;
                }
            }
            if (!(nodeDef.childFlags & queryFlags) || !(nodeDef.childFlags & staticDynamicQueryFlag)) {
                // no child has a matching query
                // then skip the children
                i += nodeDef.childCount;
            }
        }
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var initialized = false;

    /**
     * @return {?}
     */
    function initServicesIfNeeded() {
        if (initialized) {
            return;
        }
        initialized = true;
        var /** @type {?} */ services = isDevMode() ? createDebugServices() : createProdServices();
        Services.setCurrentNode = services.setCurrentNode;
        Services.createRootView = services.createRootView;
        Services.createEmbeddedView = services.createEmbeddedView;
        Services.createComponentView = services.createComponentView;
        Services.createNgModuleRef = services.createNgModuleRef;
        Services.overrideProvider = services.overrideProvider;
        Services.overrideComponentView = services.overrideComponentView;
        Services.clearOverrides = services.clearOverrides;
        Services.checkAndUpdateView = services.checkAndUpdateView;
        Services.checkNoChangesView = services.checkNoChangesView;
        Services.destroyView = services.destroyView;
        Services.resolveDep = resolveDep;
        Services.createDebugContext = services.createDebugContext;
        Services.handleEvent = services.handleEvent;
        Services.updateDirectives = services.updateDirectives;
        Services.updateRenderer = services.updateRenderer;
        Services.dirtyParentQueries = dirtyParentQueries;
    }

    /**
     * @return {?}
     */
    function createProdServices() {
        return {
            setCurrentNode: function () {
            },
            createRootView: createProdRootView,
            createEmbeddedView: createEmbeddedView,
            createComponentView: createComponentView,
            createNgModuleRef: createNgModuleRef,
            overrideProvider: NOOP,
            overrideComponentView: NOOP,
            clearOverrides: NOOP,
            checkAndUpdateView: checkAndUpdateView,
            checkNoChangesView: checkNoChangesView,
            destroyView: destroyView,
            createDebugContext: function (view, nodeIndex) {
                return new DebugContext_(view, nodeIndex);
            },
            handleEvent: function (view, nodeIndex, eventName, event) {
                return view.def.handleEvent(view, nodeIndex, eventName, event);
            },
            updateDirectives: function (view, checkType) {
                return view.def.updateDirectives(checkType === 0 /* CheckAndUpdate */ ? prodCheckAndUpdateNode :
                    prodCheckNoChangesNode, view);
            },
            updateRenderer: function (view, checkType) {
                return view.def.updateRenderer(checkType === 0 /* CheckAndUpdate */ ? prodCheckAndUpdateNode :
                    prodCheckNoChangesNode, view);
            },
        };
    }

    /**
     * @return {?}
     */
    function createDebugServices() {
        return {
            setCurrentNode: debugSetCurrentNode,
            createRootView: debugCreateRootView,
            createEmbeddedView: debugCreateEmbeddedView,
            createComponentView: debugCreateComponentView,
            createNgModuleRef: debugCreateNgModuleRef,
            overrideProvider: debugOverrideProvider,
            overrideComponentView: debugOverrideComponentView,
            clearOverrides: debugClearOverrides,
            checkAndUpdateView: debugCheckAndUpdateView,
            checkNoChangesView: debugCheckNoChangesView,
            destroyView: debugDestroyView,
            createDebugContext: function (view, nodeIndex) {
                return new DebugContext_(view, nodeIndex);
            },
            handleEvent: debugHandleEvent,
            updateDirectives: debugUpdateDirectives,
            updateRenderer: debugUpdateRenderer,
        };
    }

    /**
     * @param {?} elInjector
     * @param {?} projectableNodes
     * @param {?} rootSelectorOrNode
     * @param {?} def
     * @param {?} ngModule
     * @param {?=} context
     * @return {?}
     */
    function createProdRootView(elInjector, projectableNodes, rootSelectorOrNode, def, ngModule, context) {
        var /** @type {?} */ rendererFactory = ngModule.injector.get(RendererFactory2);
        return createRootView(createRootData(elInjector, ngModule, rendererFactory, projectableNodes, rootSelectorOrNode), def, context);
    }

    /**
     * @param {?} elInjector
     * @param {?} projectableNodes
     * @param {?} rootSelectorOrNode
     * @param {?} def
     * @param {?} ngModule
     * @param {?=} context
     * @return {?}
     */
    function debugCreateRootView(elInjector, projectableNodes, rootSelectorOrNode, def, ngModule, context) {
        var /** @type {?} */ rendererFactory = ngModule.injector.get(RendererFactory2);
        var /** @type {?} */ root = createRootData(elInjector, ngModule, new DebugRendererFactory2(rendererFactory), projectableNodes, rootSelectorOrNode);
        var /** @type {?} */ defWithOverride = applyProviderOverridesToView(def);
        return callWithDebugContext(DebugAction.create, createRootView, null, [root, defWithOverride, context]);
    }

    /**
     * @param {?} elInjector
     * @param {?} ngModule
     * @param {?} rendererFactory
     * @param {?} projectableNodes
     * @param {?} rootSelectorOrNode
     * @return {?}
     */
    function createRootData(elInjector, ngModule, rendererFactory, projectableNodes, rootSelectorOrNode) {
        var /** @type {?} */ sanitizer = ngModule.injector.get(Sanitizer);
        var /** @type {?} */ errorHandler = ngModule.injector.get(ErrorHandler);
        var /** @type {?} */ renderer = rendererFactory.createRenderer(null, null);
        return {
            ngModule: ngModule,
            injector: elInjector,
            projectableNodes: projectableNodes,
            selectorOrNode: rootSelectorOrNode,
            sanitizer: sanitizer,
            rendererFactory: rendererFactory,
            renderer: renderer,
            errorHandler: errorHandler
        };
    }

    /**
     * @param {?} parentView
     * @param {?} anchorDef
     * @param {?} viewDef
     * @param {?=} context
     * @return {?}
     */
    function debugCreateEmbeddedView(parentView, anchorDef, viewDef$$1, context) {
        var /** @type {?} */ defWithOverride = applyProviderOverridesToView(viewDef$$1);
        return callWithDebugContext(DebugAction.create, createEmbeddedView, null, [parentView, anchorDef, defWithOverride, context]);
    }

    /**
     * @param {?} parentView
     * @param {?} nodeDef
     * @param {?} viewDef
     * @param {?} hostElement
     * @return {?}
     */
    function debugCreateComponentView(parentView, nodeDef, viewDef$$1, hostElement) {
        var /** @type {?} */ overrideComponentView = viewDefOverrides.get(/** @type {?} */ ((((((nodeDef.element)).componentProvider)).provider)).token);
        if (overrideComponentView) {
            viewDef$$1 = overrideComponentView;
        }
        else {
            viewDef$$1 = applyProviderOverridesToView(viewDef$$1);
        }
        return callWithDebugContext(DebugAction.create, createComponentView, null, [parentView, nodeDef, viewDef$$1, hostElement]);
    }

    /**
     * @param {?} moduleType
     * @param {?} parentInjector
     * @param {?} bootstrapComponents
     * @param {?} def
     * @return {?}
     */
    function debugCreateNgModuleRef(moduleType, parentInjector, bootstrapComponents, def) {
        var /** @type {?} */ defWithOverride = applyProviderOverridesToNgModule(def);
        return createNgModuleRef(moduleType, parentInjector, bootstrapComponents, defWithOverride);
    }

    var providerOverrides = /*@__PURE__*/ new Map();
    var viewDefOverrides = /*@__PURE__*/ new Map();

    /**
     * @param {?} override
     * @return {?}
     */
    function debugOverrideProvider(override) {
        providerOverrides.set(override.token, override);
    }

    /**
     * @param {?} comp
     * @param {?} compFactory
     * @return {?}
     */
    function debugOverrideComponentView(comp, compFactory) {
        var /** @type {?} */ hostViewDef = resolveDefinition(getComponentViewDefinitionFactory(compFactory));
        var /** @type {?} */ compViewDef = resolveDefinition(/** @type {?} */ ((((hostViewDef.nodes[0].element)).componentView)));
        viewDefOverrides.set(comp, compViewDef);
    }

    /**
     * @return {?}
     */
    function debugClearOverrides() {
        providerOverrides.clear();
        viewDefOverrides.clear();
    }

    /**
     * @param {?} def
     * @return {?}
     */
    function applyProviderOverridesToView(def) {
        if (providerOverrides.size === 0) {
            return def;
        }
        var /** @type {?} */ elementIndicesWithOverwrittenProviders = findElementIndicesWithOverwrittenProviders(def);
        if (elementIndicesWithOverwrittenProviders.length === 0) {
            return def;
        }
        // clone the whole view definition,
        // as it maintains references between the nodes that are hard to update.
        def = /** @type {?} */ ((def.factory))(function () {
            return NOOP;
        });
        for (var /** @type {?} */ i = 0; i < elementIndicesWithOverwrittenProviders.length; i++) {
            applyProviderOverridesToElement(def, elementIndicesWithOverwrittenProviders[i]);
        }
        return def;

        /**
         * @param {?} def
         * @return {?}
         */
        function findElementIndicesWithOverwrittenProviders(def) {
            var /** @type {?} */ elIndicesWithOverwrittenProviders = [];
            var /** @type {?} */ lastElementDef = null;
            for (var /** @type {?} */ i = 0; i < def.nodes.length; i++) {
                var /** @type {?} */ nodeDef = def.nodes[i];
                if (nodeDef.flags & 1 /* TypeElement */) {
                    lastElementDef = nodeDef;
                }
                if (lastElementDef && nodeDef.flags & 3840 /* CatProviderNoDirective */ &&
                    providerOverrides.has(/** @type {?} */ ((nodeDef.provider)).token)) {
                    elIndicesWithOverwrittenProviders.push(/** @type {?} */ ((lastElementDef)).nodeIndex);
                    lastElementDef = null;
                }
            }
            return elIndicesWithOverwrittenProviders;
        }

        /**
         * @param {?} viewDef
         * @param {?} elIndex
         * @return {?}
         */
        function applyProviderOverridesToElement(viewDef$$1, elIndex) {
            for (var /** @type {?} */ i = elIndex + 1; i < viewDef$$1.nodes.length; i++) {
                var /** @type {?} */ nodeDef = viewDef$$1.nodes[i];
                if (nodeDef.flags & 1 /* TypeElement */) {
                    // stop at the next element
                    return;
                }
                if (nodeDef.flags & 3840 /* CatProviderNoDirective */) {
                    var /** @type {?} */ provider = ((nodeDef.provider));
                    var /** @type {?} */ override = providerOverrides.get(provider.token);
                    if (override) {
                        nodeDef.flags = (nodeDef.flags & ~3840 /* CatProviderNoDirective */) | override.flags;
                        provider.deps = splitDepsDsl(override.deps);
                        provider.value = override.value;
                    }
                }
            }
        }
    }

    /**
     * @param {?} def
     * @return {?}
     */
    function applyProviderOverridesToNgModule(def) {
        var _a = calcHasOverrides(def), hasOverrides = _a.hasOverrides,
            hasDeprecatedOverrides = _a.hasDeprecatedOverrides;
        if (!hasOverrides) {
            return def;
        }
        // clone the whole view definition,
        // as it maintains references between the nodes that are hard to update.
        def = /** @type {?} */ ((def.factory))(function () {
            return NOOP;
        });
        applyProviderOverrides(def);
        return def;

        /**
         * @param {?} def
         * @return {?}
         */
        function calcHasOverrides(def) {
            var /** @type {?} */ hasOverrides = false;
            var /** @type {?} */ hasDeprecatedOverrides = false;
            if (providerOverrides.size === 0) {
                return {hasOverrides: hasOverrides, hasDeprecatedOverrides: hasDeprecatedOverrides};
            }
            def.providers.forEach(function (node) {
                var /** @type {?} */ override = providerOverrides.get(node.token);
                if ((node.flags & 3840 /* CatProviderNoDirective */) && override) {
                    hasOverrides = true;
                    hasDeprecatedOverrides = hasDeprecatedOverrides || override.deprecatedBehavior;
                }
            });
            return {hasOverrides: hasOverrides, hasDeprecatedOverrides: hasDeprecatedOverrides};
        }

        /**
         * @param {?} def
         * @return {?}
         */
        function applyProviderOverrides(def) {
            for (var /** @type {?} */ i = 0; i < def.providers.length; i++) {
                var /** @type {?} */ provider = def.providers[i];
                if (hasDeprecatedOverrides) {
                    // We had a bug where me made
                    // all providers lazy. Keep this logic behind a flag
                    // for migrating existing users.
                    provider.flags |= 4096 /* LazyProvider */;
                }
                var /** @type {?} */ override = providerOverrides.get(provider.token);
                if (override) {
                    provider.flags = (provider.flags & ~3840 /* CatProviderNoDirective */) | override.flags;
                    provider.deps = splitDepsDsl(override.deps);
                    provider.value = override.value;
                }
            }
        }
    }

    /**
     * @param {?} view
     * @param {?} checkIndex
     * @param {?} argStyle
     * @param {?=} v0
     * @param {?=} v1
     * @param {?=} v2
     * @param {?=} v3
     * @param {?=} v4
     * @param {?=} v5
     * @param {?=} v6
     * @param {?=} v7
     * @param {?=} v8
     * @param {?=} v9
     * @return {?}
     */
    function prodCheckAndUpdateNode(view, checkIndex, argStyle, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9) {
        var /** @type {?} */ nodeDef = view.def.nodes[checkIndex];
        checkAndUpdateNode(view, nodeDef, argStyle, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9);
        return (nodeDef.flags & 224 /* CatPureExpression */) ?
            asPureExpressionData(view, checkIndex).value :
            undefined;
    }

    /**
     * @param {?} view
     * @param {?} checkIndex
     * @param {?} argStyle
     * @param {?=} v0
     * @param {?=} v1
     * @param {?=} v2
     * @param {?=} v3
     * @param {?=} v4
     * @param {?=} v5
     * @param {?=} v6
     * @param {?=} v7
     * @param {?=} v8
     * @param {?=} v9
     * @return {?}
     */
    function prodCheckNoChangesNode(view, checkIndex, argStyle, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9) {
        var /** @type {?} */ nodeDef = view.def.nodes[checkIndex];
        checkNoChangesNode(view, nodeDef, argStyle, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9);
        return (nodeDef.flags & 224 /* CatPureExpression */) ?
            asPureExpressionData(view, checkIndex).value :
            undefined;
    }

    /**
     * @param {?} view
     * @return {?}
     */
    function debugCheckAndUpdateView(view) {
        return callWithDebugContext(DebugAction.detectChanges, checkAndUpdateView, null, [view]);
    }

    /**
     * @param {?} view
     * @return {?}
     */
    function debugCheckNoChangesView(view) {
        return callWithDebugContext(DebugAction.checkNoChanges, checkNoChangesView, null, [view]);
    }

    /**
     * @param {?} view
     * @return {?}
     */
    function debugDestroyView(view) {
        return callWithDebugContext(DebugAction.destroy, destroyView, null, [view]);
    }

    /** @enum {number} */
    var DebugAction = /*@__PURE__*/ (function () {
        var DebugAction = {
            create: 0,
            detectChanges: 1,
            checkNoChanges: 2,
            destroy: 3,
            handleEvent: 4,
        };
        DebugAction[DebugAction.create] = "create";
        DebugAction[DebugAction.detectChanges] = "detectChanges";
        DebugAction[DebugAction.checkNoChanges] = "checkNoChanges";
        DebugAction[DebugAction.destroy] = "destroy";
        DebugAction[DebugAction.handleEvent] = "handleEvent";
        return DebugAction;
    })();
    var _currentAction;
    var _currentView;
    var _currentNodeIndex;

    /**
     * @param {?} view
     * @param {?} nodeIndex
     * @return {?}
     */
    function debugSetCurrentNode(view, nodeIndex) {
        _currentView = view;
        _currentNodeIndex = nodeIndex;
    }

    /**
     * @param {?} view
     * @param {?} nodeIndex
     * @param {?} eventName
     * @param {?} event
     * @return {?}
     */
    function debugHandleEvent(view, nodeIndex, eventName, event) {
        debugSetCurrentNode(view, nodeIndex);
        return callWithDebugContext(DebugAction.handleEvent, view.def.handleEvent, null, [view, nodeIndex, eventName, event]);
    }

    /**
     * @param {?} view
     * @param {?} checkType
     * @return {?}
     */
    function debugUpdateDirectives(view, checkType) {
        if (view.state & 128 /* Destroyed */) {
            throw viewDestroyedError(DebugAction[_currentAction]);
        }
        debugSetCurrentNode(view, nextDirectiveWithBinding(view, 0));
        return view.def.updateDirectives(debugCheckDirectivesFn, view);

        /**
         * @param {?} view
         * @param {?} nodeIndex
         * @param {?} argStyle
         * @param {...?} values
         * @return {?}
         */
        function debugCheckDirectivesFn(view, nodeIndex, argStyle) {
            var values = [];
            for (var _i = 3; _i < arguments.length; _i++) {
                values[_i - 3] = arguments[_i];
            }
            var /** @type {?} */ nodeDef = view.def.nodes[nodeIndex];
            if (checkType === 0 /* CheckAndUpdate */) {
                debugCheckAndUpdateNode(view, nodeDef, argStyle, values);
            }
            else {
                debugCheckNoChangesNode(view, nodeDef, argStyle, values);
            }
            if (nodeDef.flags & 16384 /* TypeDirective */) {
                debugSetCurrentNode(view, nextDirectiveWithBinding(view, nodeIndex));
            }
            return (nodeDef.flags & 224 /* CatPureExpression */) ?
                asPureExpressionData(view, nodeDef.nodeIndex).value :
                undefined;
        }
    }

    /**
     * @param {?} view
     * @param {?} checkType
     * @return {?}
     */
    function debugUpdateRenderer(view, checkType) {
        if (view.state & 128 /* Destroyed */) {
            throw viewDestroyedError(DebugAction[_currentAction]);
        }
        debugSetCurrentNode(view, nextRenderNodeWithBinding(view, 0));
        return view.def.updateRenderer(debugCheckRenderNodeFn, view);

        /**
         * @param {?} view
         * @param {?} nodeIndex
         * @param {?} argStyle
         * @param {...?} values
         * @return {?}
         */
        function debugCheckRenderNodeFn(view, nodeIndex, argStyle) {
            var values = [];
            for (var _i = 3; _i < arguments.length; _i++) {
                values[_i - 3] = arguments[_i];
            }
            var /** @type {?} */ nodeDef = view.def.nodes[nodeIndex];
            if (checkType === 0 /* CheckAndUpdate */) {
                debugCheckAndUpdateNode(view, nodeDef, argStyle, values);
            }
            else {
                debugCheckNoChangesNode(view, nodeDef, argStyle, values);
            }
            if (nodeDef.flags & 3 /* CatRenderNode */) {
                debugSetCurrentNode(view, nextRenderNodeWithBinding(view, nodeIndex));
            }
            return (nodeDef.flags & 224 /* CatPureExpression */) ?
                asPureExpressionData(view, nodeDef.nodeIndex).value :
                undefined;
        }
    }

    /**
     * @param {?} view
     * @param {?} nodeDef
     * @param {?} argStyle
     * @param {?} givenValues
     * @return {?}
     */
    function debugCheckAndUpdateNode(view, nodeDef, argStyle, givenValues) {
        var /** @type {?} */ changed = ((checkAndUpdateNode)).apply(void 0, [view, nodeDef, argStyle].concat(givenValues));
        if (changed) {
            var /** @type {?} */ values = argStyle === 1 /* Dynamic */ ? givenValues[0] : givenValues;
            if (nodeDef.flags & 16384 /* TypeDirective */) {
                var /** @type {?} */ bindingValues = {};
                for (var /** @type {?} */ i = 0; i < nodeDef.bindings.length; i++) {
                    var /** @type {?} */ binding = nodeDef.bindings[i];
                    var /** @type {?} */ value = values[i];
                    if (binding.flags & 8 /* TypeProperty */) {
                        bindingValues[normalizeDebugBindingName(/** @type {?} */ ((binding.nonMinifiedName)))] =
                            normalizeDebugBindingValue(value);
                    }
                }
                var /** @type {?} */ elDef = ((nodeDef.parent));
                var /** @type {?} */ el = asElementData(view, elDef.nodeIndex).renderElement;
                if (!((elDef.element)).name) {
                    // a comment.
                    view.renderer.setValue(el, "bindings=" + JSON.stringify(bindingValues, null, 2));
                }
                else {
                    // a regular element.
                    for (var /** @type {?} */ attr in bindingValues) {
                        var /** @type {?} */ value = bindingValues[attr];
                        if (value != null) {
                            view.renderer.setAttribute(el, attr, value);
                        }
                        else {
                            view.renderer.removeAttribute(el, attr);
                        }
                    }
                }
            }
        }
    }

    /**
     * @param {?} view
     * @param {?} nodeDef
     * @param {?} argStyle
     * @param {?} values
     * @return {?}
     */
    function debugCheckNoChangesNode(view, nodeDef, argStyle, values) {
        ((checkNoChangesNode)).apply(void 0, [view, nodeDef, argStyle].concat(values));
    }

    /**
     * @param {?} name
     * @return {?}
     */
    function normalizeDebugBindingName(name) {
        // Attribute names with `$` (eg `x-y$`) are valid per spec, but unsupported by some browsers
        name = camelCaseToDashCase(name.replace(/[$@]/g, '_'));
        return "ng-reflect-" + name;
    }

    var CAMEL_CASE_REGEXP = /([A-Z])/g;

    /**
     * @param {?} input
     * @return {?}
     */
    function camelCaseToDashCase(input) {
        return input.replace(CAMEL_CASE_REGEXP, function () {
            var m = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                m[_i] = arguments[_i];
            }
            return '-' + m[1].toLowerCase();
        });
    }

    /**
     * @param {?} value
     * @return {?}
     */
    function normalizeDebugBindingValue(value) {
        try {
            // Limit the size of the value as otherwise the DOM just gets polluted.
            return value != null ? value.toString().slice(0, 30) : value;
        }
        catch (e) {
            return '[ERROR] Exception while trying to serialize the value';
        }
    }

    /**
     * @param {?} view
     * @param {?} nodeIndex
     * @return {?}
     */
    function nextDirectiveWithBinding(view, nodeIndex) {
        for (var /** @type {?} */ i = nodeIndex; i < view.def.nodes.length; i++) {
            var /** @type {?} */ nodeDef = view.def.nodes[i];
            if (nodeDef.flags & 16384 /* TypeDirective */ && nodeDef.bindings && nodeDef.bindings.length) {
                return i;
            }
        }
        return null;
    }

    /**
     * @param {?} view
     * @param {?} nodeIndex
     * @return {?}
     */
    function nextRenderNodeWithBinding(view, nodeIndex) {
        for (var /** @type {?} */ i = nodeIndex; i < view.def.nodes.length; i++) {
            var /** @type {?} */ nodeDef = view.def.nodes[i];
            if ((nodeDef.flags & 3 /* CatRenderNode */) && nodeDef.bindings && nodeDef.bindings.length) {
                return i;
            }
        }
        return null;
    }

    var DebugContext_ = /*@__PURE__*/ (/*@__PURE__*/ function () {
        function DebugContext_(view, nodeIndex) {
            this.view = view;
            this.nodeIndex = nodeIndex;
            if (nodeIndex == null) {
                this.nodeIndex = nodeIndex = 0;
            }
            this.nodeDef = view.def.nodes[nodeIndex];
            var /** @type {?} */ elDef = this.nodeDef;
            var /** @type {?} */ elView = view;
            while (elDef && (elDef.flags & 1 /* TypeElement */) === 0) {
                elDef = /** @type {?} */ ((elDef.parent));
            }
            if (!elDef) {
                while (!elDef && elView) {
                    elDef = /** @type {?} */ ((viewParentEl(elView)));
                    elView = /** @type {?} */ ((elView.parent));
                }
            }
            this.elDef = elDef;
            this.elView = elView;
        }

        Object.defineProperty(DebugContext_.prototype, "elOrCompView", {
            get: /**
             * @return {?}
             */ function () {
                // Has to be done lazily as we use the DebugContext also during creation of elements...
                return asElementData(this.elView, this.elDef.nodeIndex).componentView || this.view;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DebugContext_.prototype, "injector", {
            get: /**
             * @return {?}
             */ function () {
                return createInjector(this.elView, this.elDef);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DebugContext_.prototype, "component", {
            get: /**
             * @return {?}
             */ function () {
                return this.elOrCompView.component;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DebugContext_.prototype, "context", {
            get: /**
             * @return {?}
             */ function () {
                return this.elOrCompView.context;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DebugContext_.prototype, "providerTokens", {
            get: /**
             * @return {?}
             */ function () {
                var /** @type {?} */ tokens = [];
                if (this.elDef) {
                    for (var /** @type {?} */ i = this.elDef.nodeIndex + 1; i <= this.elDef.nodeIndex + this.elDef.childCount; i++) {
                        var /** @type {?} */ childDef = this.elView.def.nodes[i];
                        if (childDef.flags & 20224 /* CatProvider */) {
                            tokens.push(/** @type {?} */ ((childDef.provider)).token);
                        }
                        i += childDef.childCount;
                    }
                }
                return tokens;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DebugContext_.prototype, "references", {
            get: /**
             * @return {?}
             */ function () {
                var /** @type {?} */ references = {};
                if (this.elDef) {
                    collectReferences(this.elView, this.elDef, references);
                    for (var /** @type {?} */ i = this.elDef.nodeIndex + 1; i <= this.elDef.nodeIndex + this.elDef.childCount; i++) {
                        var /** @type {?} */ childDef = this.elView.def.nodes[i];
                        if (childDef.flags & 20224 /* CatProvider */) {
                            collectReferences(this.elView, childDef, references);
                        }
                        i += childDef.childCount;
                    }
                }
                return references;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DebugContext_.prototype, "componentRenderElement", {
            get: /**
             * @return {?}
             */ function () {
                var /** @type {?} */ elData = findHostElement(this.elOrCompView);
                return elData ? elData.renderElement : undefined;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DebugContext_.prototype, "renderNode", {
            get: /**
             * @return {?}
             */ function () {
                return this.nodeDef.flags & 2 /* TypeText */ ? renderNode(this.view, this.nodeDef) :
                    renderNode(this.elView, this.elDef);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @param {?} console
         * @param {...?} values
         * @return {?}
         */
        DebugContext_.prototype.logError = /**
         * @param {?} console
         * @param {...?} values
         * @return {?}
         */
        function (console) {
            var values = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                values[_i - 1] = arguments[_i];
            }
            var /** @type {?} */ logViewDef;
            var /** @type {?} */ logNodeIndex;
            if (this.nodeDef.flags & 2 /* TypeText */) {
                logViewDef = this.view.def;
                logNodeIndex = this.nodeDef.nodeIndex;
            }
            else {
                logViewDef = this.elView.def;
                logNodeIndex = this.elDef.nodeIndex;
            }
            // Note: we only generate a log function for text and element nodes
            // to make the generated code as small as possible.
            var /** @type {?} */ renderNodeIndex = getRenderNodeIndex(logViewDef, logNodeIndex);
            var /** @type {?} */ currRenderNodeIndex = -1;
            var /** @type {?} */ nodeLogger = function () {
                currRenderNodeIndex++;
                if (currRenderNodeIndex === renderNodeIndex) {
                    return (_a = console.error).bind.apply(_a, [console].concat(values));
                }
                else {
                    return NOOP;
                }
                var _a;
            };
            /** @type {?} */
            ((logViewDef.factory))(nodeLogger);
            if (currRenderNodeIndex < renderNodeIndex) {
                console.error('Illegal state: the ViewDefinitionFactory did not call the logger!');
                console.error.apply(console, values);
            }
        };
        return DebugContext_;
    }());

    /**
     * @param {?} viewDef
     * @param {?} nodeIndex
     * @return {?}
     */
    function getRenderNodeIndex(viewDef$$1, nodeIndex) {
        var /** @type {?} */ renderNodeIndex = -1;
        for (var /** @type {?} */ i = 0; i <= nodeIndex; i++) {
            var /** @type {?} */ nodeDef = viewDef$$1.nodes[i];
            if (nodeDef.flags & 3 /* CatRenderNode */) {
                renderNodeIndex++;
            }
        }
        return renderNodeIndex;
    }

    /**
     * @param {?} view
     * @return {?}
     */
    function findHostElement(view) {
        while (view && !isComponentView(view)) {
            view = /** @type {?} */ ((view.parent));
        }
        if (view.parent) {
            return asElementData(view.parent, /** @type {?} */ ((viewParentEl(view))).nodeIndex);
        }
        return null;
    }

    /**
     * @param {?} view
     * @param {?} nodeDef
     * @param {?} references
     * @return {?}
     */
    function collectReferences(view, nodeDef, references) {
        for (var /** @type {?} */ refName in nodeDef.references) {
            references[refName] = getQueryValue(view, nodeDef, nodeDef.references[refName]);
        }
    }

    /**
     * @param {?} action
     * @param {?} fn
     * @param {?} self
     * @param {?} args
     * @return {?}
     */
    function callWithDebugContext(action, fn, self, args) {
        var /** @type {?} */ oldAction = _currentAction;
        var /** @type {?} */ oldView = _currentView;
        var /** @type {?} */ oldNodeIndex = _currentNodeIndex;
        try {
            _currentAction = action;
            var /** @type {?} */ result = fn.apply(self, args);
            _currentView = oldView;
            _currentNodeIndex = oldNodeIndex;
            _currentAction = oldAction;
            return result;
        }
        catch (e) {
            if (isViewDebugError(e) || !_currentView) {
                throw e;
            }
            throw viewWrappedDebugError(e, /** @type {?} */ ((getCurrentDebugContext())));
        }
    }

    /**
     * @return {?}
     */
    function getCurrentDebugContext() {
        return _currentView ? new DebugContext_(_currentView, _currentNodeIndex) : null;
    }

    var DebugRendererFactory2 = /*@__PURE__*/ (/*@__PURE__*/ function () {
        function DebugRendererFactory2(delegate) {
            this.delegate = delegate;
        }

        /**
         * @param {?} element
         * @param {?} renderData
         * @return {?}
         */
        DebugRendererFactory2.prototype.createRenderer = /**
         * @param {?} element
         * @param {?} renderData
         * @return {?}
         */
        function (element, renderData) {
            return new DebugRenderer2(this.delegate.createRenderer(element, renderData));
        };
        /**
         * @return {?}
         */
        DebugRendererFactory2.prototype.begin = /**
         * @return {?}
         */
        function () {
            if (this.delegate.begin) {
                this.delegate.begin();
            }
        };
        /**
         * @return {?}
         */
        DebugRendererFactory2.prototype.end = /**
         * @return {?}
         */
        function () {
            if (this.delegate.end) {
                this.delegate.end();
            }
        };
        /**
         * @return {?}
         */
        DebugRendererFactory2.prototype.whenRenderingDone = /**
         * @return {?}
         */
        function () {
            if (this.delegate.whenRenderingDone) {
                return this.delegate.whenRenderingDone();
            }
            return Promise.resolve(null);
        };
        return DebugRendererFactory2;
    }());
    var DebugRenderer2 = /*@__PURE__*/ (/*@__PURE__*/ function () {
        function DebugRenderer2(delegate) {
            this.delegate = delegate;
            this.data = this.delegate.data;
        }

        /**
         * @param {?} node
         * @return {?}
         */
        DebugRenderer2.prototype.destroyNode = /**
         * @param {?} node
         * @return {?}
         */
        function (node) {
            removeDebugNodeFromIndex(/** @type {?} */ ((getDebugNode(node))));
            if (this.delegate.destroyNode) {
                this.delegate.destroyNode(node);
            }
        };
        /**
         * @return {?}
         */
        DebugRenderer2.prototype.destroy = /**
         * @return {?}
         */
        function () {
            this.delegate.destroy();
        };
        /**
         * @param {?} name
         * @param {?=} namespace
         * @return {?}
         */
        DebugRenderer2.prototype.createElement = /**
         * @param {?} name
         * @param {?=} namespace
         * @return {?}
         */
        function (name, namespace) {
            var /** @type {?} */ el = this.delegate.createElement(name, namespace);
            var /** @type {?} */ debugCtx = getCurrentDebugContext();
            if (debugCtx) {
                var /** @type {?} */ debugEl = new DebugElement(el, null, debugCtx);
                debugEl.name = name;
                indexDebugNode(debugEl);
            }
            return el;
        };
        /**
         * @param {?} value
         * @return {?}
         */
        DebugRenderer2.prototype.createComment = /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            var /** @type {?} */ comment = this.delegate.createComment(value);
            var /** @type {?} */ debugCtx = getCurrentDebugContext();
            if (debugCtx) {
                indexDebugNode(new DebugNode(comment, null, debugCtx));
            }
            return comment;
        };
        /**
         * @param {?} value
         * @return {?}
         */
        DebugRenderer2.prototype.createText = /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            var /** @type {?} */ text = this.delegate.createText(value);
            var /** @type {?} */ debugCtx = getCurrentDebugContext();
            if (debugCtx) {
                indexDebugNode(new DebugNode(text, null, debugCtx));
            }
            return text;
        };
        /**
         * @param {?} parent
         * @param {?} newChild
         * @return {?}
         */
        DebugRenderer2.prototype.appendChild = /**
         * @param {?} parent
         * @param {?} newChild
         * @return {?}
         */
        function (parent, newChild) {
            var /** @type {?} */ debugEl = getDebugNode(parent);
            var /** @type {?} */ debugChildEl = getDebugNode(newChild);
            if (debugEl && debugChildEl && debugEl instanceof DebugElement) {
                debugEl.addChild(debugChildEl);
            }
            this.delegate.appendChild(parent, newChild);
        };
        /**
         * @param {?} parent
         * @param {?} newChild
         * @param {?} refChild
         * @return {?}
         */
        DebugRenderer2.prototype.insertBefore = /**
         * @param {?} parent
         * @param {?} newChild
         * @param {?} refChild
         * @return {?}
         */
        function (parent, newChild, refChild) {
            var /** @type {?} */ debugEl = getDebugNode(parent);
            var /** @type {?} */ debugChildEl = getDebugNode(newChild);
            var /** @type {?} */ debugRefEl = ((getDebugNode(refChild)));
            if (debugEl && debugChildEl && debugEl instanceof DebugElement) {
                debugEl.insertBefore(debugRefEl, debugChildEl);
            }
            this.delegate.insertBefore(parent, newChild, refChild);
        };
        /**
         * @param {?} parent
         * @param {?} oldChild
         * @return {?}
         */
        DebugRenderer2.prototype.removeChild = /**
         * @param {?} parent
         * @param {?} oldChild
         * @return {?}
         */
        function (parent, oldChild) {
            var /** @type {?} */ debugEl = getDebugNode(parent);
            var /** @type {?} */ debugChildEl = getDebugNode(oldChild);
            if (debugEl && debugChildEl && debugEl instanceof DebugElement) {
                debugEl.removeChild(debugChildEl);
            }
            this.delegate.removeChild(parent, oldChild);
        };
        /**
         * @param {?} selectorOrNode
         * @return {?}
         */
        DebugRenderer2.prototype.selectRootElement = /**
         * @param {?} selectorOrNode
         * @return {?}
         */
        function (selectorOrNode) {
            var /** @type {?} */ el = this.delegate.selectRootElement(selectorOrNode);
            var /** @type {?} */ debugCtx = getCurrentDebugContext();
            if (debugCtx) {
                indexDebugNode(new DebugElement(el, null, debugCtx));
            }
            return el;
        };
        /**
         * @param {?} el
         * @param {?} name
         * @param {?} value
         * @param {?=} namespace
         * @return {?}
         */
        DebugRenderer2.prototype.setAttribute = /**
         * @param {?} el
         * @param {?} name
         * @param {?} value
         * @param {?=} namespace
         * @return {?}
         */
        function (el, name, value, namespace) {
            var /** @type {?} */ debugEl = getDebugNode(el);
            if (debugEl && debugEl instanceof DebugElement) {
                var /** @type {?} */ fullName = namespace ? namespace + ':' + name : name;
                debugEl.attributes[fullName] = value;
            }
            this.delegate.setAttribute(el, name, value, namespace);
        };
        /**
         * @param {?} el
         * @param {?} name
         * @param {?=} namespace
         * @return {?}
         */
        DebugRenderer2.prototype.removeAttribute = /**
         * @param {?} el
         * @param {?} name
         * @param {?=} namespace
         * @return {?}
         */
        function (el, name, namespace) {
            var /** @type {?} */ debugEl = getDebugNode(el);
            if (debugEl && debugEl instanceof DebugElement) {
                var /** @type {?} */ fullName = namespace ? namespace + ':' + name : name;
                debugEl.attributes[fullName] = null;
            }
            this.delegate.removeAttribute(el, name, namespace);
        };
        /**
         * @param {?} el
         * @param {?} name
         * @return {?}
         */
        DebugRenderer2.prototype.addClass = /**
         * @param {?} el
         * @param {?} name
         * @return {?}
         */
        function (el, name) {
            var /** @type {?} */ debugEl = getDebugNode(el);
            if (debugEl && debugEl instanceof DebugElement) {
                debugEl.classes[name] = true;
            }
            this.delegate.addClass(el, name);
        };
        /**
         * @param {?} el
         * @param {?} name
         * @return {?}
         */
        DebugRenderer2.prototype.removeClass = /**
         * @param {?} el
         * @param {?} name
         * @return {?}
         */
        function (el, name) {
            var /** @type {?} */ debugEl = getDebugNode(el);
            if (debugEl && debugEl instanceof DebugElement) {
                debugEl.classes[name] = false;
            }
            this.delegate.removeClass(el, name);
        };
        /**
         * @param {?} el
         * @param {?} style
         * @param {?} value
         * @param {?} flags
         * @return {?}
         */
        DebugRenderer2.prototype.setStyle = /**
         * @param {?} el
         * @param {?} style
         * @param {?} value
         * @param {?} flags
         * @return {?}
         */
        function (el, style, value, flags) {
            var /** @type {?} */ debugEl = getDebugNode(el);
            if (debugEl && debugEl instanceof DebugElement) {
                debugEl.styles[style] = value;
            }
            this.delegate.setStyle(el, style, value, flags);
        };
        /**
         * @param {?} el
         * @param {?} style
         * @param {?} flags
         * @return {?}
         */
        DebugRenderer2.prototype.removeStyle = /**
         * @param {?} el
         * @param {?} style
         * @param {?} flags
         * @return {?}
         */
        function (el, style, flags) {
            var /** @type {?} */ debugEl = getDebugNode(el);
            if (debugEl && debugEl instanceof DebugElement) {
                debugEl.styles[style] = null;
            }
            this.delegate.removeStyle(el, style, flags);
        };
        /**
         * @param {?} el
         * @param {?} name
         * @param {?} value
         * @return {?}
         */
        DebugRenderer2.prototype.setProperty = /**
         * @param {?} el
         * @param {?} name
         * @param {?} value
         * @return {?}
         */
        function (el, name, value) {
            var /** @type {?} */ debugEl = getDebugNode(el);
            if (debugEl && debugEl instanceof DebugElement) {
                debugEl.properties[name] = value;
            }
            this.delegate.setProperty(el, name, value);
        };
        /**
         * @param {?} target
         * @param {?} eventName
         * @param {?} callback
         * @return {?}
         */
        DebugRenderer2.prototype.listen = /**
         * @param {?} target
         * @param {?} eventName
         * @param {?} callback
         * @return {?}
         */
        function (target, eventName, callback) {
            if (typeof target !== 'string') {
                var /** @type {?} */ debugEl = getDebugNode(target);
                if (debugEl) {
                    debugEl.listeners.push(new EventListener(eventName, callback));
                }
            }
            return this.delegate.listen(target, eventName, callback);
        };
        /**
         * @param {?} node
         * @return {?}
         */
        DebugRenderer2.prototype.parentNode = /**
         * @param {?} node
         * @return {?}
         */
        function (node) {
            return this.delegate.parentNode(node);
        };
        /**
         * @param {?} node
         * @return {?}
         */
        DebugRenderer2.prototype.nextSibling = /**
         * @param {?} node
         * @return {?}
         */
        function (node) {
            return this.delegate.nextSibling(node);
        };
        /**
         * @param {?} node
         * @param {?} value
         * @return {?}
         */
        DebugRenderer2.prototype.setValue = /**
         * @param {?} node
         * @param {?} value
         * @return {?}
         */
        function (node, value) {
            return this.delegate.setValue(node, value);
        };
        return DebugRenderer2;
    }());
    var NgModuleFactory_ = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
        __extends(NgModuleFactory_, _super);

        function NgModuleFactory_(moduleType, _bootstrapComponents, _ngModuleDefFactory) {
            var _this =
                // Attention: this ctor is called as top level function.
                // Putting any logic in here will destroy closure tree shaking!
                _super.call(this) || this;
            _this.moduleType = moduleType;
            _this._bootstrapComponents = _bootstrapComponents;
            _this._ngModuleDefFactory = _ngModuleDefFactory;
            return _this;
        }

        /**
         * @param {?} parentInjector
         * @return {?}
         */
        NgModuleFactory_.prototype.create = /**
         * @param {?} parentInjector
         * @return {?}
         */
        function (parentInjector) {
            initServicesIfNeeded();
            var /** @type {?} */ def = resolveDefinition(this._ngModuleDefFactory);
            return Services.createNgModuleRef(this.moduleType, parentInjector || Injector.NULL, this._bootstrapComponents, def);
        };
        return NgModuleFactory_;
    }(NgModuleFactory));
    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
// The functions in this file verify that the assumptions we are making
// about state in an instruction are correct before implementing any logic.
// They are meant only to be called in dev mode as sanity checks.
    /**
     * Stringifies values such that strings are wrapped in explicit quotation marks and
     * other types are stringified normally. Used in error messages (e.g. assertThrow)
     * to make it clear that certain values are of the string type when comparing.
     *
     * e.g. `expected "3" to be 3` is easier to understand than `expected 3 to be 3`.
     *
     * @param {?} value The value to be stringified
     * @return {?} The stringified value
     */
    function stringifyValueForError(value) {
        if (value && value.native && value.native.outerHTML) {
            return value.native.outerHTML;
        }
        return typeof value === 'string' ? "\"" + value + "\"" : value;
    }

    /**
     * @param {?} actual
     * @param {?} name
     * @return {?}
     */
    /**
     * @template T
     * @param {?} actual
     * @param {?} expected
     * @param {?} name
     * @param {?=} serializer
     * @return {?}
     */
    function assertEqual(actual, expected, name, serializer) {
        (actual != expected) && assertThrow(actual, expected, name, '==', serializer);
    }

    /**
     * @template T
     * @param {?} actual
     * @param {?} expected
     * @param {?} name
     * @return {?}
     */
    function assertLessThan(actual, expected, name) {
        (actual >= expected) && assertThrow(actual, expected, name, '<');
    }

    /**
     * @template T
     * @param {?} actual
     * @param {?} name
     * @return {?}
     */
    function assertNotNull(actual, name) {
        assertNotEqual(actual, null, name);
    }

    /**
     * @template T
     * @param {?} actual
     * @param {?} expected
     * @param {?} name
     * @return {?}
     */
    function assertNotEqual(actual, expected, name) {
        (actual == expected) && assertThrow(actual, expected, name, '!=');
    }

    /**
     * Throws an error with a message constructed from the arguments.
     *
     * @template T
     * @param {?} actual The actual value (e.g. 3)
     * @param {?} expected The expected value (e.g. 5)
     * @param {?} name The name of the value being checked (e.g. attrs.length)
     * @param {?} operator The comparison operator (e.g. <, >, ==)
     * @param {?=} serializer Function that maps a value to its display value
     * @return {?}
     */
    function assertThrow(actual, expected, name, operator, serializer) {
        if (serializer === void 0) {
            serializer = stringifyValueForError;
        }
        var /** @type {?} */ error = "ASSERT: expected " + name + " " + operator + " " + serializer(expected) + " but was " + serializer(actual) + "!";
        debugger; // leave `debugger` here to aid in debugging.
        throw new Error(error);
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    if (typeof ngDevMode == 'undefined') {
        if (typeof window != 'undefined')
            ((window)).ngDevMode = true;
        if (typeof self != 'undefined')
            ((self)).ngDevMode = true;
        if (typeof global != 'undefined')
            ((global)).ngDevMode = true;
    }
    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */

    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * @param {?} node
     * @param {?} type
     * @return {?}
     */
    function assertNodeType(node, type) {
        assertNotEqual(node, null, 'node');
        assertEqual(node.flags & 3 /* TYPE_MASK */, type, 'Node.type', typeSerializer);
    }

    /**
     * @param {?} type
     * @return {?}
     */
    function typeSerializer(type) {
        if (type == 1 /* Projection */)
            return 'Projection';
        if (type == 0 /* Container */)
            return 'Container';
        if (type == 2 /* View */)
            return 'View';
        if (type == 3 /* Element */)
            return 'Element';
        return '??? ' + type + ' ???';
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */

    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * If this is the first template pass, any ngOnInit or ngDoCheck hooks will be queued into
     * TView.initHooks during directiveCreate.
     *
     * The directive index and hook type are encoded into one number (1st bit: type, remaining bits:
     * directive index), then saved in the even indices of the initHooks array. The odd indices
     * hold the hook functions themselves.
     *
     * @param {?} index The index of the directive in LView.data
     * @param {?} onInit
     * @param {?} doCheck
     * @param {?} tView The current TView
     * @return {?}
     */
    function queueInitHooks(index, onInit, doCheck, tView) {
        if (tView.firstTemplatePass === true) {
            if (onInit != null) {
                (tView.initHooks || (tView.initHooks = [])).push(index, onInit);
            }
            if (doCheck != null) {
                (tView.initHooks || (tView.initHooks = [])).push(index, doCheck);
                (tView.checkHooks || (tView.checkHooks = [])).push(index, doCheck);
            }
        }
    }

    /**
     * Loops through the directives on a node and queues all their hooks except ngOnInit
     * and ngDoCheck, which are queued separately in directiveCreate.
     * @param {?} flags
     * @param {?} currentView
     * @return {?}
     */
    function queueLifecycleHooks(flags, currentView) {
        var /** @type {?} */ tView = currentView.tView;
        if (tView.firstTemplatePass === true) {
            var /** @type {?} */ size = (flags & 4092 /* SIZE_MASK */) >> 2;
            var /** @type {?} */ start = flags >> 12;
            // It's necessary to loop through the directives at elementEnd() (rather than processing in
            // directiveCreate) so we can preserve the current hook order. Content, view, and destroy
            // hooks for projected components and directives must be called *before* their hosts.
            for (var /** @type {?} */ i = start, /** @type {?} */ end = start + size; i < end; i++) {
                var /** @type {?} */ def = ((tView.data[i]));
                queueContentHooks(def, tView, i);
                queueViewHooks(def, tView, i);
                queueDestroyHooks(def, tView, i);
            }
        }
    }

    /**
     * Queues afterContentInit and afterContentChecked hooks on TView
     * @param {?} def
     * @param {?} tView
     * @param {?} i
     * @return {?}
     */
    function queueContentHooks(def, tView, i) {
        if (def.afterContentInit != null) {
            (tView.contentHooks || (tView.contentHooks = [])).push(i, def.afterContentInit);
        }
        if (def.afterContentChecked != null) {
            (tView.contentHooks || (tView.contentHooks = [])).push(i, def.afterContentChecked);
            (tView.contentCheckHooks || (tView.contentCheckHooks = [])).push(i, def.afterContentChecked);
        }
    }

    /**
     * Queues afterViewInit and afterViewChecked hooks on TView
     * @param {?} def
     * @param {?} tView
     * @param {?} i
     * @return {?}
     */
    function queueViewHooks(def, tView, i) {
        if (def.afterViewInit != null) {
            (tView.viewHooks || (tView.viewHooks = [])).push(i, def.afterViewInit);
        }
        if (def.afterViewChecked != null) {
            (tView.viewHooks || (tView.viewHooks = [])).push(i, def.afterViewChecked);
            (tView.viewCheckHooks || (tView.viewCheckHooks = [])).push(i, def.afterViewChecked);
        }
    }

    /**
     * Queues onDestroy hooks on TView
     * @param {?} def
     * @param {?} tView
     * @param {?} i
     * @return {?}
     */
    function queueDestroyHooks(def, tView, i) {
        if (def.onDestroy != null) {
            (tView.destroyHooks || (tView.destroyHooks = [])).push(i, def.onDestroy);
        }
    }

    /**
     * Calls onInit and doCheck calls if they haven't already been called.
     *
     * @param {?} currentView The current view
     * @param {?} tView
     * @param {?} creationMode
     * @return {?}
     */
    function executeInitHooks(currentView, tView, creationMode) {
        if (currentView.lifecycleStage === 1 /* INIT */) {
            executeHooks(currentView.data, tView.initHooks, tView.checkHooks, creationMode);
            currentView.lifecycleStage = 2 /* CONTENT_INIT */;
        }
    }

    /**
     * Calls all afterContentInit and afterContentChecked hooks for the view, then splices
     * out afterContentInit hooks to prep for the next run in update mode.
     *
     * @param {?} currentView The current view
     * @param {?} tView
     * @param {?} creationMode
     * @return {?}
     */
    function executeContentHooks(currentView, tView, creationMode) {
        if (currentView.lifecycleStage < 3 /* VIEW_INIT */) {
            executeHooks(currentView.data, tView.contentHooks, tView.contentCheckHooks, creationMode);
            currentView.lifecycleStage = 3 /* VIEW_INIT */;
        }
    }

    /**
     * Iterates over afterViewInit and afterViewChecked functions and calls them.
     *
     * @param {?} data
     * @param {?} allHooks
     * @param {?} checkHooks
     * @param {?} creationMode
     * @return {?}
     */
    function executeHooks(data, allHooks, checkHooks, creationMode) {
        var /** @type {?} */ hooksToCall = creationMode ? allHooks : checkHooks;
        if (hooksToCall != null) {
            callHooks(data, hooksToCall);
        }
    }

    /**
     * Calls lifecycle hooks with their contexts, skipping init hooks if it's not
     * creation mode.
     *
     * @param {?} data
     * @param {?} arr The array in which the hooks are found
     * @return {?}
     */
    function callHooks(data, arr) {
        for (var /** @type {?} */ i = 0; i < arr.length; i += 2) {
            ((arr[i | 1])).call(data[(arr[i])]);
        }
    }

    /**
     * Object Oriented style of API needed to create elements and text nodes.
     *
     * This is the native browser API style, e.g. operations are methods on individual objects
     * like HTMLElement. With this style, no additional code is needed as a facade
     * (reducing payload size).
     *
     * @record
     */
    /**
     * Procedural style of API needed to create elements and text nodes.
     *
     * In non-native browser environments (e.g. platforms such as web-workers), this is the
     * facade that enables element manipulation. This also facilitates backwards compatibility
     * with Renderer2.
     * @record
     */
    /**
     * @record
     */
    var domRendererFactory3 = {
        createRenderer: function (hostElement, rendererType) {
            return document;
        }
    };
    /**
     * Subset of API needed for appending elements and text nodes.
     * @record
     */
    /**
     * Subset of API needed for writing attributes, properties, and setting up
     * listeners on Element.
     * @record
     */
    /**
     * @record
     */
    /**
     * @record
     */
    /**
     * @record
     */
// Note: This hack is necessary so we don't erroneously get a circular dependency
// failure based on types.
    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * `LView` stores all of the information needed to process the instructions as
     * they are invoked from the template. Each embedded view and component view has its
     * own `LView`. When processing a particular view, we set the `currentView` to that
     * `LView`. When that view is done processing, the `currentView` is set back to
     * whatever the original `currentView` was before (the parent `LView`).
     *
     * Keeping separate state for each view facilities view insertion / deletion, so we
     * don't have to edit the data array based on which views are present.
     * @record
     */
    /**
     * Interface necessary to work with view tree traversal
     * @record
     */
    /**
     * The static data for an LView (shared between all templates of a
     * given type).
     *
     * Stored on the template function as ngPrivateData.
     * @record
     */
// Note: This hack is necessary so we don't erroneously get a circular dependency
// failure based on types.
    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */

    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * Returns the first RNode following the given LNode in the same parent DOM element.
     *
     * This is needed in order to insert the given node with insertBefore.
     *
     * @param {?} node The node whose following DOM node must be found.
     * @param {?} stopNode A parent node at which the lookup in the tree should be stopped, or null if the
     * lookup should not be stopped until the result is found.
     * @return {?} RNode before which the provided node should be inserted or null if the lookup was
     * stopped
     * or if there is no native node after the given logical node in the same native parent.
     */
    function findNextRNodeSibling(node, stopNode) {
        var /** @type {?} */ currentNode = node;
        while (currentNode && currentNode !== stopNode) {
            var /** @type {?} */ pNextOrParent = currentNode.pNextOrParent;
            if (pNextOrParent) {
                var /** @type {?} */ pNextOrParentType = pNextOrParent.flags & 3;
                while (pNextOrParentType !== 1 /* Projection */) {
                    var /** @type {?} */ nativeNode = findFirstRNode(pNextOrParent);
                    if (nativeNode) {
                        return nativeNode;
                    }
                    pNextOrParent = /** @type {?} */ ((pNextOrParent.pNextOrParent));
                }
                currentNode = pNextOrParent;
            }
            else {
                var /** @type {?} */ currentSibling = currentNode.next;
                while (currentSibling) {
                    var /** @type {?} */ nativeNode = findFirstRNode(currentSibling);
                    if (nativeNode) {
                        return nativeNode;
                    }
                    currentSibling = currentSibling.next;
                }
                var /** @type {?} */ parentNode = currentNode.parent;
                currentNode = null;
                if (parentNode) {
                    var /** @type {?} */ parentType = parentNode.flags & 3;
                    if (parentType === 0 /* Container */ || parentType === 2 /* View */) {
                        currentNode = parentNode;
                    }
                }
            }
        }
        return null;
    }

    /**
     * Get the next node in the LNode tree, taking into account the place where a node is
     * projected (in the shadow DOM) rather than where it comes from (in the light DOM).
     *
     * @param {?} node The node whose next node in the LNode tree must be found.
     * @return {?} LNode|null The next sibling in the LNode tree.
     */
    function getNextLNodeWithProjection(node) {
        var /** @type {?} */ pNextOrParent = node.pNextOrParent;
        if (pNextOrParent) {
            // The node is projected
            var /** @type {?} */ isLastProjectedNode = (pNextOrParent.flags & 3 /* TYPE_MASK */) === 1;
            // returns pNextOrParent if we are not at the end of the list, null otherwise
            return isLastProjectedNode ? null : pNextOrParent;
        }
        // returns node.next because the the node is not projected
        return node.next;
    }

    /**
     * Find the next node in the LNode tree, taking into account the place where a node is
     * projected (in the shadow DOM) rather than where it comes from (in the light DOM).
     *
     * If there is no sibling node, this function goes to the next sibling of the parent node...
     * until it reaches rootNode (at which point null is returned).
     *
     * @param {?} initialNode The node whose following node in the LNode tree must be found.
     * @param {?} rootNode The root node at which the lookup should stop.
     * @return {?} LNode|null The following node in the LNode tree.
     */
    function getNextOrParentSiblingNode(initialNode, rootNode) {
        var /** @type {?} */ node = initialNode;
        var /** @type {?} */ nextNode = getNextLNodeWithProjection(node);
        while (node && !nextNode) {
            // if node.pNextOrParent is not null here, it is not the next node
            // (because, at this point, nextNode is null, so it is the parent)
            node = node.pNextOrParent || node.parent;
            if (node === rootNode) {
                return null;
            }
            nextNode = node && getNextLNodeWithProjection(node);
        }
        return nextNode;
    }

    /**
     * Returns the first RNode inside the given LNode.
     *
     * @param {?} rootNode
     * @return {?} RNode The first RNode of the given LNode or null if there is none.
     */
    function findFirstRNode(rootNode) {
        var /** @type {?} */ node = rootNode;
        while (node) {
            var /** @type {?} */ type = node.flags & 3;
            var /** @type {?} */ nextNode = null;
            if (type === 3 /* Element */) {
                // A LElementNode has a matching RNode in LElementNode.native
                return ((node)).native;
            }
            else if (type === 0 /* Container */) {
                // For container look at the first node of the view next
                var /** @type {?} */ childContainerData = ((node)).data;
                nextNode = childContainerData.views.length ? childContainerData.views[0].child : null;
            }
            else if (type === 1 /* Projection */) {
                // For Projection look at the first projected node
                nextNode = ((node)).data.head;
            }
            else {
                // Otherwise look at the first child
                nextNode = ((node)).child;
            }
            node = nextNode === null ? getNextOrParentSiblingNode(node, rootNode) : nextNode;
        }
        return null;
    }

    /**
     * Returns whether a child native element should be inserted now in the given parent.
     *
     * If the parent is a view, the element will be appended as part of viewEnd(), so
     * the element should not be appended now. Similarly, if the child is a content child
     * of a parent component, the child will be appended to the right position later by
     * the content projection system.
     *
     * @param {?} parent The parent in which to insert the child
     * @param {?} view
     * @return {?} Whether the child element should be inserted now.
     */
    function canInsertNativeNode(parent, view) {
        // Only add native child element to parent element if the parent element is regular Element.
        // If parent is:
        // - Regular element => add child
        // - Component host element =>
        //    - Current View, and parent view same => content => don't add -> parent component will
        //    re-project if needed.
        //    - Current View, and parent view different => view => add Child
        // - View element => View's get added separately.
        return ((parent.flags & 3 /* TYPE_MASK */) === 3 /* Element */ &&
            (parent.view !== view /* Crossing View Boundaries, it is Component, but add Element of View */
                || parent.data === null /* Regular Element. */));
        // we are adding to an Element which is either:
        // - Not a component (will not be re-projected, just added)
        // - View of the Component
    }

    /**
     * Appends the provided child element to the provided parent, if appropriate.
     *
     * If the parent is a view, the element will be appended as part of viewEnd(), so
     * the element should not be appended now. Similarly, if the child is a content child
     * of a parent component, the child will be appended to the right position later by
     * the content projection system. Otherwise, append normally.
     *
     * @param {?} parent The parent to which to append the child
     * @param {?} child The child that should be appended
     * @param {?} currentView The current LView
     * @return {?} Whether or not the child was appended
     */
    function appendChild(parent, child, currentView) {
        if (child !== null && canInsertNativeNode(parent, currentView)) {
            // We only add element if not in View or not projected.
            var /** @type {?} */ renderer = currentView.renderer;
            ((renderer)).listen ? /** @type {?} */ ((((renderer)).appendChild))(/** @type {?} */ (((parent.native))), child) : /** @type {?} */ ((parent.native)).appendChild(child);
            return true;
        }
        return false;
    }

    /**
     * Inserts the provided node before the correct element in the DOM, if appropriate.
     *
     * If the parent is a view, the element will be inserted as part of viewEnd(), so
     * the element should not be inserted now. Similarly, if the child is a content child
     * of a parent component, the child will be inserted to the right position later by
     * the content projection system. Otherwise, insertBefore normally.
     *
     * @param {?} node Node to insert
     * @param {?} currentView Current LView
     * @return {?}
     */
    function insertChild(node, currentView) {
        var /** @type {?} */ parent = ((node.parent));
        // Only add child element to parent element if the parent element is regular Element.
        // If parent is:
        // - Normal element => add child
        // - Component element =>
        //    - Current View, and parent view same => content don't add -> parent component will
        //    re-project if needed.
        //    - Current View, and parent view different => view => add Child
        // - View element => View's get added separately.
        if (canInsertNativeNode(parent, currentView)) {
            // We only add element if not in View or not projected.
            var /** @type {?} */ nativeSibling = findNextRNodeSibling(node, null);
            var /** @type {?} */ renderer = currentView.renderer;
            ((renderer)).listen ? /** @type {?} */ ((((renderer))
                .insertBefore))(/** @type {?} */ ((parent.native)), /** @type {?} */ ((node.native)), nativeSibling) : /** @type {?} */ ((parent.native)).insertBefore(/** @type {?} */ ((node.native)), nativeSibling, false);
        }
    }

    /**
     * Appends a projected node to the DOM, or in the case of a projected container,
     * appends the nodes from all of the container's active views to the DOM.
     *
     * @param {?} node The node to process
     * @param {?} currentParent The last parent element to be processed
     * @param {?} currentView Current LView
     * @return {?}
     */
    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * A utility function to match an Ivy node static data against a simple CSS selector
     *
     * @param {?} tNode
     * @param {?} selector
     * @return {?} true if node matches the selector.
     */
    /**
     * @param {?} tNode
     * @param {?} selector
     * @return {?}
     */
    /**
     * @param {?} tNode
     * @param {?} selector
     * @return {?}
     */
    /**
     * Checks a given node against matching selectors and returns
     * selector index (or 0 if none matched);
     * @param {?} tNode
     * @param {?} selectors
     * @return {?}
     */
    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */

    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * Must use this method for CD (instead of === ) since NaN !== NaN
     * @param {?} a
     * @param {?} b
     * @return {?}
     */
    function isDifferent(a, b) {
        // NaN is the only value that is not equal to itself so the first
        // test checks if both a and b are not NaN
        return !(a !== a && b !== b) && a !== b;
    }

    /**
     * @param {?} value
     * @return {?}
     */
    function stringify$1(value) {
        if (typeof value == 'function')
            return value.name || value;
        if (typeof value == 'string')
            return value;
        if (value == null)
            return '';
        return '' + value;
    }

    /**
     * Flattens an array in non-recursive way. Input arrays are not modified.
     * @param {?} list
     * @return {?}
     */
    function flatten$1(list) {
        var /** @type {?} */ result = [];
        var /** @type {?} */ i = 0;
        while (i < list.length) {
            var /** @type {?} */ item = list[i];
            if (Array.isArray(item)) {
                if (item.length > 0) {
                    list = item.concat(list.slice(i + 1));
                    i = 0;
                }
                else {
                    i++;
                }
            }
            else {
                result.push(item);
                i++;
            }
        }
        return result;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * Directive (D) sets a property on all component instances using this constant as a key and the
     * component's host node (LElement) as the value. This is used in methods like detectChanges to
     * facilitate jumping from an instance to the host node.
     */
    var NG_HOST_SYMBOL = '__ngHostLNode__';
    /**
     * This property gets set before entering a template.
     *
     * This renderer can be one of two varieties of Renderer3:
     *
     * - ObjectedOrientedRenderer3
     *
     * This is the native browser API style, e.g. operations are methods on individual objects
     * like HTMLElement. With this style, no additional code is needed as a facade (reducing payload
     * size).
     *
     * - ProceduralRenderer3
     *
     * In non-native browser environments (e.g. platforms such as web-workers), this is the facade
     * that enables element manipulation. This also facilitates backwards compatibility with
     * Renderer2.
     */
    var renderer;
    var rendererFactory;
    /**
     * Used to set the parent property when nodes are created.
     */
    var previousOrParentNode;
    /**
     * If `isParent` is:
     *  - `true`: then `previousOrParentNode` points to a parent node.
     *  - `false`: then `previousOrParentNode` points to previous node (sibling).
     */
    var isParent;
    /**
     * Static data that corresponds to the instance-specific data array on an LView.
     *
     * Each node's static data is stored in tData at the same index that it's stored
     * in the data array. Each directive's definition is stored here at the same index
     * as its directive instance in the data array. Any nodes that do not have static
     * data store a null value in tData to avoid a sparse array.
     */
    var tData;
    /**
     * State of the current view being processed.
     */
    var currentView;
// The initialization has to be after the `let`, otherwise `createLView` can't see `let`.
    currentView = /*@__PURE__*/ createLView(/** @type {?} */ ((null)), /** @type {?} */ ((null)), /*@__PURE__*/ createTView());
    var currentQueries;
    /**
     * This property gets set before entering a template.
     */
    var creationMode;
    /**
     * An array of nodes (text, element, container, etc), their bindings, and
     * any local variables that need to be stored between invocations.
     */
    var data;
    /**
     * Points to the next binding index to read or write to.
     */
    var bindingIndex;
    /**
     * When a view is destroyed, listeners need to be released and outputs need to be
     * unsubscribed. This cleanup array stores both listener data (in chunks of 4)
     * and output data (in chunks of 2) for a particular view. Combining the arrays
     * saves on memory (70 bytes per array) and on a few bytes of code size (for two
     * separate for loops).
     *
     * If it's a listener being stored:
     * 1st index is: event name to remove
     * 2nd index is: native element
     * 3rd index is: listener function
     * 4th index is: useCapture boolean
     *
     * If it's an output subscription:
     * 1st index is: unsubscribe function
     * 2nd index is: context for function
     */
    var cleanup;

    /**
     * Swap the current state with a new state.
     *
     * For performance reasons we store the state in the top level of the module.
     * This way we minimize the number of properties to read. Whenever a new view
     * is entered we have to store the state for later, and when the view is
     * exited the state has to be restored
     *
     * @param {?} newView New state to become active
     * @param {?} host Element to which the View is a child of
     * @return {?} the previous state;
     */
    function enterView(newView, host) {
        var /** @type {?} */ oldView = currentView;
        data = newView.data;
        bindingIndex = newView.bindingStartIndex || 0;
        tData = newView.tView.data;
        creationMode = newView.creationMode;
        cleanup = newView.cleanup;
        renderer = newView.renderer;
        if (host != null) {
            previousOrParentNode = host;
            isParent = true;
        }
        currentView = newView;
        currentQueries = newView.queries;
        return /** @type {?} */ ((oldView));
    }

    /**
     * Used in lieu of enterView to make it clear when we are exiting a child view. This makes
     * the direction of traversal (up or down the view tree) a bit clearer.
     * @param {?} newView
     * @return {?}
     */
    function leaveView(newView) {
        executeHooks(currentView.data, currentView.tView.viewHooks, currentView.tView.viewCheckHooks, creationMode);
        currentView.creationMode = false;
        currentView.lifecycleStage = 1 /* INIT */;
        currentView.tView.firstTemplatePass = false;
        enterView(newView, null);
    }

    /**
     * @param {?} viewId
     * @param {?} renderer
     * @param {?} tView
     * @param {?=} template
     * @param {?=} context
     * @return {?}
     */
    function createLView(viewId, renderer, tView, template, context) {
        if (template === void 0) {
            template = null;
        }
        if (context === void 0) {
            context = null;
        }
        var /** @type {?} */ newView = {
            parent: currentView,
            id: viewId,
            // -1 for component views
            node: /** @type {?} */ ((null)),
            // until we initialize it in createNode.
            data: [],
            tView: tView,
            cleanup: null,
            renderer: renderer,
            child: null,
            tail: null,
            next: null,
            bindingStartIndex: null,
            creationMode: true,
            template: template,
            context: context,
            dynamicViewCount: 0,
            lifecycleStage: 1 /* INIT */,
            queries: null,
        };
        return newView;
    }

    /**
     * @param {?} index
     * @param {?} type
     * @param {?} native
     * @param {?=} state
     * @return {?}
     */
    function createLNode(index, type, native, state) {
        var /** @type {?} */ parent = isParent ? previousOrParentNode :
            previousOrParentNode && /** @type {?} */ (previousOrParentNode.parent);
        var /** @type {?} */ queries = (isParent ? currentQueries : previousOrParentNode && previousOrParentNode.queries) ||
            parent && parent.queries && parent.queries.child();
        var /** @type {?} */ isState = state != null;
        var /** @type {?} */ node = {
            flags: type,
            native: /** @type {?} */ (native),
            view: currentView,
            parent: /** @type {?} */ (parent),
            child: null,
            next: null,
            nodeInjector: parent ? parent.nodeInjector : null,
            data: isState ? /** @type {?} */ (state) : null,
            queries: queries,
            tNode: null,
            pNextOrParent: null
        };
        if ((type & 2 /* ViewOrElement */) === 2 /* ViewOrElement */ && isState) {
            // Bit of a hack to bust through the readonly because there is a circular dep between
            // LView and LNode.
            ngDevMode && assertEqual(((state)).node, null, 'lView.node');
            (((state))).node = node;
        }
        if (index != null) {
            // We are Element or Container
            ngDevMode && assertDataNext(index);
            data[index] = node;
            // Every node adds a value to the static data array to avoid a sparse array
            if (index >= tData.length) {
                tData[index] = null;
            }
            else {
                node.tNode = /** @type {?} */ (tData[index]);
            }
            // Now link ourselves into the tree.
            if (isParent) {
                currentQueries = null;
                if (previousOrParentNode.view === currentView ||
                    (previousOrParentNode.flags & 3 /* TYPE_MASK */) === 2 /* View */) {
                    // We are in the same view, which means we are adding content node to the parent View.
                    ngDevMode && assertEqual(previousOrParentNode.child, null, 'previousNode.child');
                    previousOrParentNode.child = node;
                }
                else {
                    // We are adding component view, so we don't link parent node child to this node.
                }
            }
            else if (previousOrParentNode) {
                ngDevMode && assertEqual(previousOrParentNode.next, null, 'previousNode.next');
                previousOrParentNode.next = node;
            }
        }
        previousOrParentNode = node;
        isParent = true;
        return node;
    }

    /**
     * Resets the application state.
     * @return {?}
     */
    function resetApplicationState() {
        isParent = false;
        previousOrParentNode = /** @type {?} */ ((null));
    }

    /**
     *
     * @template T
     * @param {?} hostNode
     * @param {?} template Template function with the instructions.
     * @param {?} context to pass into the template.
     * @param {?} providedRendererFactory
     * @param {?} host Existing node to render into.
     * @return {?}
     */
    /**
     * @template T
     * @param {?} viewNode
     * @param {?} template
     * @param {?} context
     * @param {?} renderer
     * @return {?}
     */
    function renderEmbeddedTemplate(viewNode, template, context, renderer) {
        var /** @type {?} */ _isParent = isParent;
        var /** @type {?} */ _previousOrParentNode = previousOrParentNode;
        try {
            isParent = true;
            previousOrParentNode = /** @type {?} */ ((null));
            var /** @type {?} */ cm = false;
            if (viewNode == null) {
                var /** @type {?} */ view = createLView(-1, renderer, createTView(), template, context);
                viewNode = createLNode(null, 2 /* View */, null, view);
                cm = true;
            }
            enterView(viewNode.data, viewNode);
            template(context, cm);
        }
        finally {
            refreshDynamicChildren();
            leaveView(/** @type {?} */ ((((currentView)).parent)));
            isParent = _isParent;
            previousOrParentNode = _previousOrParentNode;
        }
        return viewNode;
    }

    /**
     * @template T
     * @param {?} node
     * @param {?} hostView
     * @param {?} componentOrContext
     * @param {?=} template
     * @return {?}
     */
    function renderComponentOrTemplate(node, hostView, componentOrContext, template) {
        var /** @type {?} */ oldView = enterView(hostView, node);
        try {
            if (rendererFactory.begin) {
                rendererFactory.begin();
            }
            if (template) {
                template(/** @type {?} */ ((componentOrContext)), creationMode);
            }
            else {
                // Element was stored at 0 and directive was stored at 1 in renderComponent
                // so to refresh the component, refresh() needs to be called with (1, 0)
                componentRefresh(1, 0);
            }
        }
        finally {
            if (rendererFactory.end) {
                rendererFactory.end();
            }
            leaveView(oldView);
        }
    }

    /**
     * Create DOM element. The instruction must later be followed by `elementEnd()` call.
     *
     * @param {?} index Index of the element in the data array
     * @param {?=} nameOrComponentType Name of the DOM Node or `ComponentType` to create.
     * @param {?=} attrs Statically bound set of attributes to be written into the DOM element on creation.
     * @param {?=} directiveTypes A set of directives declared on this element.
     * @param {?=} localRefs A set of local reference bindings on the element.
     *
     * Attributes and localRefs are passed as an array of strings where elements with an even index
     * hold an attribute name and elements with an odd index hold an attribute value, ex.:
     * ['id', 'warning5', 'class', 'alert']
     * @return {?}
     */
    function elementStart(index, nameOrComponentType, attrs, directiveTypes, localRefs) {
        var /** @type {?} */ node;
        var /** @type {?} */ native;
        if (nameOrComponentType == null) {
            // native node retrieval - used for exporting elements as tpl local variables (<div #foo>)
            var /** @type {?} */ node_1 = ((data[index]));
            native = node_1 && ((node_1)).native;
        }
        else {
            ngDevMode && assertEqual(currentView.bindingStartIndex, null, 'bindingStartIndex');
            var /** @type {?} */ isHostElement = typeof nameOrComponentType !== 'string';
            // MEGAMORPHIC: `ngComponentDef` is a megamorphic property access here.
            // This is OK, since we will refactor this code and store the result in `TView.data`
            // which means that we will be reading this value only once. We are trading clean/simple
            // template
            // code for slight startup(first run) performance. (No impact on subsequent runs)
            // TODO(misko): refactor this to store the `ComponentDef` in `TView.data`.
            var /** @type {?} */ hostComponentDef = isHostElement ? ((nameOrComponentType)).ngComponentDef : null;
            var /** @type {?} */ name_1 = isHostElement ? /** @type {?} */ ((hostComponentDef)).tag : /** @type {?} */ (nameOrComponentType);
            if (name_1 === null) {
                // TODO: future support for nameless components.
                throw 'for now name is required';
            }
            else {
                native = renderer.createElement(name_1);
                var /** @type {?} */ componentView = null;
                if (isHostElement) {
                    var /** @type {?} */ tView = getOrCreateTView(/** @type {?} */ ((hostComponentDef)).template);
                    componentView = addToViewTree(createLView(-1, rendererFactory.createRenderer(native, /** @type {?} */ ((hostComponentDef)).rendererType), tView));
                }
                // Only component views should be added to the view tree directly. Embedded views are
                // accessed through their containers because they may be removed / re-added later.
                node = createLNode(index, 3 /* Element */, native, componentView);
                // TODO(misko): implement code which caches the local reference resolution
                var /** @type {?} */ queryName = hack_findQueryName(hostComponentDef, localRefs, '');
                if (node.tNode == null) {
                    ngDevMode && assertDataInRange(index - 1);
                    node.tNode = tData[index] =
                        createTNode(name_1, attrs || null, null, hostComponentDef ? null : queryName);
                }
                if (attrs)
                    setUpAttributes(native, attrs);
                appendChild(/** @type {?} */ ((node.parent)), native, currentView);
                if (hostComponentDef) {
                    // TODO(mhevery): This assumes that the directives come in correct order, which
                    // is not guaranteed. Must be refactored to take it into account.
                    directiveCreate(++index, hostComponentDef.n(), hostComponentDef, queryName);
                }
                hack_declareDirectives(index, directiveTypes, localRefs);
            }
        }
        return native;
    }

    /**
     * This function instantiates a directive with a correct queryName. It is a hack since we should
     * compute the query value only once and store it with the template (rather than on each invocation)
     * @param {?} index
     * @param {?} directiveTypes
     * @param {?} localRefs
     * @return {?}
     */
    function hack_declareDirectives(index, directiveTypes, localRefs) {
        if (directiveTypes) {
            // TODO(mhevery): This assumes that the directives come in correct order, which
            // is not guaranteed. Must be refactored to take it into account.
            for (var /** @type {?} */ i = 0; i < directiveTypes.length; i++) {
                // MEGAMORPHIC: `ngDirectiveDef` is a megamorphic property access here.
                // This is OK, since we will refactor this code and store the result in `TView.data`
                // which means that we will be reading this value only once. We are trading clean/simple
                // template
                // code for slight startup(first run) performance. (No impact on subsequent runs)
                // TODO(misko): refactor this to store the `DirectiveDef` in `TView.data`.
                var /** @type {?} */ directiveType = directiveTypes[i];
                var /** @type {?} */ directiveDef = directiveType.ngDirectiveDef;
                directiveCreate(++index, directiveDef.n(), directiveDef, hack_findQueryName(directiveDef, localRefs));
            }
        }
    }

    /**
     * This function returns the queryName for a directive. It is a hack since we should
     * compute the query value only once and store it with the template (rather than on each invocation)
     * @param {?} directiveDef
     * @param {?} localRefs
     * @param {?=} defaultExport
     * @return {?}
     */
    function hack_findQueryName(directiveDef, localRefs, defaultExport) {
        var /** @type {?} */ exportAs = directiveDef && directiveDef.exportAs || defaultExport;
        if (exportAs != null && localRefs) {
            for (var /** @type {?} */ i = 0; i < localRefs.length; i = i + 2) {
                var /** @type {?} */ local = localRefs[i];
                var /** @type {?} */ toExportAs = localRefs[i | 1];
                if (toExportAs === exportAs || toExportAs === defaultExport) {
                    return local;
                }
            }
        }
        return null;
    }

    /**
     * Gets TView from a template function or creates a new TView
     * if it doesn't already exist.
     *
     * @param {?} template The template from which to get static data
     * @return {?} TView
     */
    function getOrCreateTView(template) {
        return template.ngPrivateData || (template.ngPrivateData = /** @type {?} */ (createTView()));
    }

    /**
     * Creates a TView instance
     * @return {?}
     */
    function createTView() {
        return {
            data: [],
            firstTemplatePass: true,
            initHooks: null,
            checkHooks: null,
            contentHooks: null,
            contentCheckHooks: null,
            viewHooks: null,
            viewCheckHooks: null,
            destroyHooks: null,
            objectLiterals: null
        };
    }

    /**
     * @param {?} native
     * @param {?} attrs
     * @return {?}
     */
    function setUpAttributes(native, attrs) {
        ngDevMode && assertEqual(attrs.length % 2, 0, 'attrs.length % 2');
        var /** @type {?} */ isProceduralRenderer = ((renderer)).setAttribute;
        for (var /** @type {?} */ i = 0; i < attrs.length; i += 2) {
            isProceduralRenderer ? /** @type {?} */ ((((renderer)).setAttribute))(native, attrs[i], attrs[i | 1]) :
                native.setAttribute(attrs[i], attrs[i | 1]);
        }
    }

    /**
     * @param {?} text
     * @param {?} token
     * @return {?}
     */
    function createError(text, token) {
        return new Error("Renderer: " + text + " [" + stringify$1(token) + "]");
    }

    /**
     * Locates the host native element, used for bootstrapping existing nodes into rendering pipeline.
     *
     * @param {?} factory
     * @param {?} elementOrSelector Render element or CSS selector to locate the element.
     * @return {?}
     */
    function locateHostElement(factory, elementOrSelector) {
        ngDevMode && assertDataInRange(-1);
        rendererFactory = factory;
        var /** @type {?} */ defaultRenderer = factory.createRenderer(null, null);
        var /** @type {?} */ rNode = typeof elementOrSelector === 'string' ?
            (((defaultRenderer)).selectRootElement ?
                ((defaultRenderer)).selectRootElement(elementOrSelector) : /** @type {?} */ ((((defaultRenderer)).querySelector))(elementOrSelector)) :
            elementOrSelector;
        if (ngDevMode && !rNode) {
            if (typeof elementOrSelector === 'string') {
                throw createError('Host node with selector not found:', elementOrSelector);
            }
            else {
                throw createError('Host node is required:', elementOrSelector);
            }
        }
        return rNode;
    }

    /**
     * Creates the host LNode.
     *
     * @param {?} rNode Render host element.
     * @param {?} def ComponentDef
     * @return {?}
     */
    function hostElement(rNode, def) {
        resetApplicationState();
        createLNode(0, 3 /* Element */, rNode, createLView(-1, renderer, getOrCreateTView(def.template)));
    }

    /**
     * Mark the end of the element.
     * @return {?}
     */
    function elementEnd() {
        if (isParent) {
            isParent = false;
        }
        else {
            ngDevMode && assertHasParent();
            previousOrParentNode = /** @type {?} */ ((previousOrParentNode.parent));
        }
        ngDevMode && assertNodeType(previousOrParentNode, 3 /* Element */);
        var /** @type {?} */ queries = previousOrParentNode.queries;
        queries && queries.addNode(previousOrParentNode);
        queueLifecycleHooks(previousOrParentNode.flags, currentView);
    }

    /**
     * Update an attribute on an Element. This is used with a `bind` instruction.
     *
     * @param {?} index The index of the element to update in the data array
     * @param {?} attrName Name of attribute. Because it is going to DOM, this is not subject to
     *        renaming as port of minification.
     * @param {?} value Value to write. This value will go through stringification.
     * @return {?}
     */
    /**
     * Update a property on an Element.
     *
     * If the property name also exists as an input property on one of the element's directives,
     * the component property will be set instead of the element property. This check must
     * be conducted at runtime so child components that add new \@Inputs don't have to be re-compiled.
     *
     * @template T
     * @param {?} index The index of the element to update in the data array
     * @param {?} propName Name of property. Because it is going to DOM, this is not subject to
     *        renaming as part of minification.
     * @param {?} value New value to write.
     * @return {?}
     */
    function elementProperty(index, propName, value) {
        if (value === NO_CHANGE)
            return;
        var /** @type {?} */ node = (data[index]);
        var /** @type {?} */ tNode = ((node.tNode));
        // if tNode.inputs is undefined, a listener has created outputs, but inputs haven't
        // yet been checked
        if (tNode.inputs === undefined) {
            // mark inputs as checked
            tNode.inputs = null;
            tNode = generatePropertyAliases(node.flags, tNode, true);
        }
        var /** @type {?} */ inputData = tNode.inputs;
        var /** @type {?} */ dataValue;
        if (inputData && (dataValue = inputData[propName])) {
            setInputsForProperty(dataValue, value);
        }
        else {
            var /** @type {?} */ native = node.native;
            ((renderer)).setProperty ?
                ((renderer)).setProperty(native, propName, value) :
                native.setProperty ? native.setProperty(propName, value) :
                    ((native))[propName] = value;
        }
    }

    /**
     * Constructs a TNode object from the arguments.
     *
     * @param {?} tagName
     * @param {?} attrs
     * @param {?} data
     * @param {?} localName
     * @return {?} the TNode object
     */
    function createTNode(tagName, attrs, data, localName) {
        return {
            tagName: tagName,
            attrs: attrs,
            localNames: localName ? [localName, -1] : null,
            initialInputs: undefined,
            inputs: undefined,
            outputs: undefined,
            data: data
        };
    }

    /**
     * Given a list of directive indices and minified input names, sets the
     * input properties on the corresponding directives.
     * @param {?} inputs
     * @param {?} value
     * @return {?}
     */
    function setInputsForProperty(inputs, value) {
        for (var /** @type {?} */ i = 0; i < inputs.length; i += 2) {
            ngDevMode && assertDataInRange(/** @type {?} */ (inputs[i]));
            data[(inputs[i])][inputs[i | 1]] = value;
        }
    }

    /**
     * This function consolidates all the inputs or outputs defined by directives
     * on this node into one object and stores it in tData so it can
     * be shared between all templates of this type.
     *
     * @param {?} flags
     * @param {?} tNode
     * @param {?=} isInputData
     * @return {?}
     */
    function generatePropertyAliases(flags, tNode, isInputData) {
        if (isInputData === void 0) {
            isInputData = false;
        }
        var /** @type {?} */ start = flags >> 12;
        var /** @type {?} */ size = (flags & 4092 /* SIZE_MASK */) >> 2;
        for (var /** @type {?} */ i = start, /** @type {?} */ ii = start + size; i < ii; i++) {
            var /** @type {?} */ directiveDef = (((tData))[i]);
            var /** @type {?} */ propertyAliasMap = isInputData ? directiveDef.inputs : directiveDef.outputs;
            for (var /** @type {?} */ publicName in propertyAliasMap) {
                if (propertyAliasMap.hasOwnProperty(publicName)) {
                    var /** @type {?} */ internalName = propertyAliasMap[publicName];
                    var /** @type {?} */ staticDirData = isInputData ?
                        (tNode.inputs || (tNode.inputs = {})) :
                        (tNode.outputs || (tNode.outputs = {}));
                    var /** @type {?} */ hasProperty = staticDirData.hasOwnProperty(publicName);
                    hasProperty ? staticDirData[publicName].push(i, internalName) :
                        (staticDirData[publicName] = [i, internalName]);
                }
            }
        }
        return tNode;
    }

    /**
     * Create static text node
     *
     * @param {?} index Index of the node in the data array.
     * @param {?=} value Value to write. This value will be stringified.
     *   If value is not provided than the actual creation of the text node is delayed.
     * @return {?}
     */
    function text(index, value) {
        ngDevMode && assertEqual(currentView.bindingStartIndex, null, 'bindingStartIndex');
        var /** @type {?} */ textNode = value != null ?
            (((renderer)).createText ?
                ((renderer)).createText(stringify$1(value)) : /** @type {?} */ ((((renderer)).createTextNode))(stringify$1(value))) :
            null;
        var /** @type {?} */ node = createLNode(index, 3 /* Element */, textNode);
        // Text nodes are self closing.
        isParent = false;
        appendChild(/** @type {?} */ ((node.parent)), textNode, currentView);
    }

    /**
     * Create text node with binding
     * Bindings should be handled externally with the proper bind(1-8) method
     *
     * @template T
     * @param {?} index Index of the node in the data array.
     * @param {?} value Stringified value to write.
     * @return {?}
     */
    function textBinding(index, value) {
        ngDevMode && assertDataInRange(index);
        var /** @type {?} */ existingNode = (data[index]);
        ngDevMode && assertNotNull(existingNode, 'existing node');
        if (existingNode.native) {
            // If DOM node exists and value changed, update textContent
            value !== NO_CHANGE &&
            (((renderer)).setValue ?
                ((renderer)).setValue(existingNode.native, stringify$1(value)) :
                existingNode.native.textContent = stringify$1(value));
        }
        else {
            // Node was created but DOM node creation was delayed. Create and append now.
            existingNode.native =
                (((renderer)).createText ?
                    ((renderer)).createText(stringify$1(value)) : /** @type {?} */ ((((renderer)).createTextNode))(stringify$1(value)));
            insertChild(existingNode, currentView);
        }
    }

    /**
     * Create a directive.
     *
     * NOTE: directives can be created in order other than the index order. They can also
     *       be retrieved before they are created in which case the value will be null.
     *
     * @template T
     * @param {?} index Each directive in a `View` will have a unique index. Directives can
     *        be created or retrieved out of order.
     * @param {?} directive The directive instance.
     * @param {?} directiveDef DirectiveDef object which contains information about the template.
     * @param {?=} queryName Name under which the query can retrieve the directive instance.
     * @return {?}
     */
    function directiveCreate(index, directive, directiveDef, queryName) {
        var /** @type {?} */ instance;
        ngDevMode && assertEqual(currentView.bindingStartIndex, null, 'bindingStartIndex');
        ngDevMode && assertPreviousIsParent();
        var /** @type {?} */ flags = ((previousOrParentNode)).flags;
        var /** @type {?} */ size = flags & 4092;
        if (size === 0) {
            flags = (index << 12 /* INDX_SHIFT */) | 4 /* SIZE_SKIP */ | flags & 3 /* TYPE_MASK */;
        }
        else {
            flags += 4 /* SIZE_SKIP */;
        }
        /** @type {?} */
        ((previousOrParentNode)).flags = flags;
        ngDevMode && assertDataInRange(index - 1);
        Object.defineProperty(directive, NG_HOST_SYMBOL, {enumerable: false, value: previousOrParentNode});
        data[index] = instance = directive;
        if (index >= tData.length) {
            tData[index] = /** @type {?} */ ((directiveDef));
            if (queryName) {
                ngDevMode && assertNotNull(previousOrParentNode.tNode, 'previousOrParentNode.tNode');
                var /** @type {?} */ tNode_1 = ((((previousOrParentNode)).tNode));
                (tNode_1.localNames || (tNode_1.localNames = [])).push(queryName, index);
            }
        }
        var /** @type {?} */ diPublic = ((directiveDef)).diPublic;
        if (diPublic) {
            diPublic(/** @type {?} */ ((directiveDef)));
        }
        var /** @type {?} */ tNode = ((previousOrParentNode.tNode));
        if (tNode && tNode.attrs) {
            setInputsFromAttrs(instance, /** @type {?} */ ((directiveDef)).inputs, tNode);
        }
        // Init hooks are queued now so ngOnInit is called in host components before
        // any projected components.
        queueInitHooks(index, directiveDef.onInit, directiveDef.doCheck, currentView.tView);
        return instance;
    }

    /**
     * Sets initial input properties on directive instances from attribute data
     *
     * @template T
     * @param {?} instance Instance of the directive on which to set the initial inputs
     * @param {?} inputs The list of inputs from the directive def
     * @param {?} tNode The static data for this node
     * @return {?}
     */
    function setInputsFromAttrs(instance, inputs, tNode) {
        var /** @type {?} */ directiveIndex = ((previousOrParentNode.flags & 4092 /* SIZE_MASK */) >> 2 /* SIZE_SHIFT */) - 1;
        var /** @type {?} */ initialInputData = (tNode.initialInputs);
        if (initialInputData === undefined || directiveIndex >= initialInputData.length) {
            initialInputData = generateInitialInputs(directiveIndex, inputs, tNode);
        }
        var /** @type {?} */ initialInputs = initialInputData[directiveIndex];
        if (initialInputs) {
            for (var /** @type {?} */ i = 0; i < initialInputs.length; i += 2) {
                ((instance))[initialInputs[i]] = initialInputs[i | 1];
            }
        }
    }

    /**
     * Generates initialInputData for a node and stores it in the template's static storage
     * so subsequent template invocations don't have to recalculate it.
     *
     * initialInputData is an array containing values that need to be set as input properties
     * for directives on this node, but only once on creation. We need this array to support
     * the case where you set an \@Input property of a directive using attribute-like syntax.
     * e.g. if you have a `name` \@Input, you can set it once like this:
     *
     * <my-component name="Bess"></my-component>
     *
     * @param {?} directiveIndex Index to store the initial input data
     * @param {?} inputs The list of inputs from the directive def
     * @param {?} tNode The static data on this node
     * @return {?}
     */
    function generateInitialInputs(directiveIndex, inputs, tNode) {
        var /** @type {?} */ initialInputData = tNode.initialInputs || (tNode.initialInputs = []);
        initialInputData[directiveIndex] = null;
        var /** @type {?} */ attrs = ((tNode.attrs));
        for (var /** @type {?} */ i = 0; i < attrs.length; i += 2) {
            var /** @type {?} */ attrName = attrs[i];
            var /** @type {?} */ minifiedInputName = inputs[attrName];
            if (minifiedInputName !== undefined) {
                var /** @type {?} */ inputsToStore = initialInputData[directiveIndex] || (initialInputData[directiveIndex] = []);
                inputsToStore.push(minifiedInputName, attrs[i | 1]);
            }
        }
        return initialInputData;
    }

    /**
     * @return {?}
     */
    function refreshDynamicChildren() {
        for (var /** @type {?} */ current = currentView.child; current !== null; current = current.next) {
            if (current.dynamicViewCount !== 0 && ((current)).views) {
                var /** @type {?} */ container_1 = (current);
                for (var /** @type {?} */ i = 0; i < container_1.views.length; i++) {
                    var /** @type {?} */ view = container_1.views[i];
                    renderEmbeddedTemplate(view, /** @type {?} */ ((view.data.template)), /** @type {?} */ ((view.data.context)), renderer);
                }
            }
        }
    }

    /**
     * Refreshes the component view.
     *
     * In other words, enters the component's view and processes it to update bindings, queries, etc.
     *
     * @template T
     * @param {?} directiveIndex
     * @param {?} elementIndex
     * @return {?}
     */
    function componentRefresh(directiveIndex, elementIndex) {
        executeInitHooks(currentView, currentView.tView, creationMode);
        executeContentHooks(currentView, currentView.tView, creationMode);
        var /** @type {?} */ template = ((tData[directiveIndex])).template;
        if (template != null) {
            ngDevMode && assertDataInRange(elementIndex);
            var /** @type {?} */ element = (((data))[elementIndex]);
            ngDevMode && assertNodeType(element, 3 /* Element */);
            ngDevMode && assertNotEqual(element.data, null, 'isComponent');
            ngDevMode && assertDataInRange(directiveIndex);
            var /** @type {?} */ directive = getDirectiveInstance(data[directiveIndex]);
            var /** @type {?} */ hostView = ((element.data));
            ngDevMode && assertNotEqual(hostView, null, 'hostView');
            var /** @type {?} */ oldView = enterView(hostView, element);
            try {
                template(directive, creationMode);
            }
            finally {
                refreshDynamicChildren();
                leaveView(oldView);
            }
        }
    }

    /**
     * Instruction to distribute projectable nodes among <ng-content> occurrences in a given template.
     * It takes all the selectors from the entire component's template and decides where
     * each projected node belongs (it re-distributes nodes among "buckets" where each "bucket" is
     * backed by a selector).
     *
     * @param {?} index
     * @param {?=} selectors
     * @return {?}
     */

    /**
     * Inserts previously re-distributed projected nodes. This instruction must be preceded by a call
     * to the projectionDef instruction.
     *
     * @param {?} nodeIndex
     * @param {?} localIndex - index under which distribution of projected nodes was memorized
     * @param {?=} selectorIndex - 0 means <ng-content> without any selector
     * @param {?=} attrs - attributes attached to the ng-content node, if present
     * @return {?}
     */
    /**
     * Adds a LView or a LContainer to the end of the current view tree.
     *
     * This structure will be used to traverse through nested views to remove listeners
     * and call onDestroy callbacks.
     *
     * @template T
     * @param {?} state The LView or LContainer to add to the view tree
     * @return {?} The state passed in
     */
    function addToViewTree(state) {
        currentView.tail ? (currentView.tail.next = state) : (currentView.child = state);
        currentView.tail = state;
        return state;
    }

    /**
     * A special value which designates that a value has not changed.
     */
    var NO_CHANGE = ({});

    /**
     * @return {?}
     */
    function initBindings() {
        if (currentView.bindingStartIndex == null) {
            bindingIndex = currentView.bindingStartIndex = data.length;
        }
    }

    /**
     * Creates a single value binding without interpolation.
     *
     * @template T
     * @param {?} value Value to diff
     * @return {?}
     */
    function bind(value) {
        if (creationMode) {
            initBindings();
            return data[bindingIndex++] = value;
        }
        var /** @type {?} */ changed = value !== NO_CHANGE && isDifferent(data[bindingIndex], value);
        if (changed) {
            data[bindingIndex] = value;
        }
        bindingIndex++;
        return changed ? value : NO_CHANGE;
    }

    /**
     * Creates an interpolation bindings with 1 argument.
     *
     * @param {?} prefix static value used for concatenation only.
     * @param {?} value value checked for change.
     * @param {?} suffix static value used for concatenation only.
     * @return {?}
     */
    function bind1(prefix, value, suffix) {
        return bind(value) === NO_CHANGE ? NO_CHANGE : prefix + stringify$1(value) + suffix;
    }

    /**
     * @return {?}
     */
    /**
     * @template T
     * @param {?} instanceOrArray
     * @return {?}
     */
    function getDirectiveInstance(instanceOrArray) {
        // Directives with content queries store an array in data[directiveIndex]
        // with the instance as the first index
        return Array.isArray(instanceOrArray) ? instanceOrArray[0] : instanceOrArray;
    }

    /**
     * @return {?}
     */
    function assertPreviousIsParent() {
        assertEqual(isParent, true, 'isParent');
    }

    /**
     * @return {?}
     */
    function assertHasParent() {
        assertNotEqual(previousOrParentNode.parent, null, 'isParent');
    }

    /**
     * @param {?} index
     * @param {?=} arr
     * @return {?}
     */
    function assertDataInRange(index, arr) {
        if (arr == null)
            arr = data;
        assertLessThan(index, arr ? arr.length : 0, 'data.length');
    }

    /**
     * @param {?} index
     * @return {?}
     */
    function assertDataNext(index) {
        assertEqual(data.length, index, 'data.length not in sequence');
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * Options that control how the component should be bootstrapped.
     * @record
     */
    /**
     * Bootstraps a component, then creates and returns a `ComponentRef` for that component.
     *
     * @template T
     * @param {?} componentType Component to bootstrap
     * @param {?} opts
     * @return {?}
     */

// TODO: A hack to not pull in the NullInjector from @angular/core.
    /**
     * Bootstraps a Component into an existing host element and returns an instance
     * of the component.
     *
     * @template T
     * @param {?} componentType Component to bootstrap
     * @param {?=} opts
     * @return {?}
     */
    function renderComponent(componentType, opts) {
        if (opts === void 0) {
            opts = {};
        }
        var /** @type {?} */ rendererFactory = opts.rendererFactory || domRendererFactory3;
        var /** @type {?} */ componentDef = (componentType.ngComponentDef);
        if (componentDef.type != componentType)
            componentDef.type = componentType;
        var /** @type {?} */ component;
        var /** @type {?} */ hostNode = locateHostElement(rendererFactory, opts.host || componentDef.tag);
        var /** @type {?} */ oldView = enterView(createLView(-1, rendererFactory.createRenderer(hostNode, componentDef.rendererType), createTView()), /** @type {?} */ ((null)));
        try {
            // Create element node at index 0 in data array
            hostElement(hostNode, componentDef);
            // Create directive instance with n() and store at index 1 in data array (el is 0)
            component = getDirectiveInstance(directiveCreate(1, componentDef.n(), componentDef));
        }
        finally {
            leaveView(oldView);
        }
        opts.features && opts.features.forEach(function (feature) {
            return feature(component, componentDef);
        });
        detectChanges(component);
        return component;
    }

    /**
     * @template T
     * @param {?} component
     * @return {?}
     */
    function detectChanges(component) {
        ngDevMode && assertNotNull(component, 'component');
        var /** @type {?} */ hostNode = (((component))[NG_HOST_SYMBOL]);
        if (ngDevMode && !hostNode) {
            createError('Not a directive instance', component);
        }
        ngDevMode && assertNotNull(hostNode.data, 'hostNode.data');
        renderComponentOrTemplate(hostNode, hostNode.view, component);

    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */

    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * Create a component definition object.
     *
     *
     * # Example
     * ```
     * class MyDirective {
     *   // Generated by Angular Template Compiler
     *   // [Symbol] syntax will not be supported by TypeScript until v2.7
     *   static ngComponentDef = defineComponent({
     *     ...
     *   });
     * }
     * ```
     * @template T
     * @param {?} componentDefinition
     * @return {?}
     */
    function defineComponent(componentDefinition) {
        var /** @type {?} */ type = componentDefinition.type;
        var /** @type {?} */ def = ({
            type: type,
            diPublic: null,
            n: componentDefinition.factory,
            tag: ((componentDefinition)).tag || /** @type {?} */ ((null)),
            template: ((componentDefinition)).template || /** @type {?} */ ((null)),
            h: componentDefinition.hostBindings || noop$1$1,
            inputs: invertObject(componentDefinition.inputs),
            outputs: invertObject(componentDefinition.outputs),
            methods: invertObject(componentDefinition.methods),
            rendererType: resolveRendererType2(componentDefinition.rendererType) || null,
            exportAs: componentDefinition.exportAs,
            onInit: type.prototype.ngOnInit || null,
            doCheck: type.prototype.ngDoCheck || null,
            afterContentInit: type.prototype.ngAfterContentInit || null,
            afterContentChecked: type.prototype.ngAfterContentChecked || null,
            afterViewInit: type.prototype.ngAfterViewInit || null,
            afterViewChecked: type.prototype.ngAfterViewChecked || null,
            onDestroy: type.prototype.ngOnDestroy || null
        });
        var /** @type {?} */ feature = componentDefinition.features;
        feature && feature.forEach(function (fn) {
            return fn(def);
        });
        return def;
    }

    /**
     * @param {?} definition
     * @return {?}
     */
    /**
     * @template T
     * @param {?} definition
     * @return {?}
     */
    var EMPTY$1 = {};

    /**
     * @return {?}
     */
    function noop$1$1() {
    }

    /**
     * Swaps the keys and values of an object.
     * @param {?} obj
     * @return {?}
     */
    function invertObject(obj) {
        if (obj == null)
            return EMPTY$1;
        var /** @type {?} */ newObj = {};
        for (var /** @type {?} */ minifiedKey in obj) {
            newObj[obj[minifiedKey]] = minifiedKey;
        }
        return newObj;
    }

    /**
     * Create a directive definition object.
     *
     * # Example
     * ```
     * class MyDirective {
     *   // Generated by Angular Template Compiler
     *   // [Symbol] syntax will not be supported by TypeScript until v2.7
     *   static ngDirectiveDef = defineDirective({
     *     ...
     *   });
     * }
     * ```
     */
    /**
     * Create a pipe definition object.
     *
     * # Example
     * ```
     * class MyPipe implements PipeTransform {
     *   // Generated by Angular Template Compiler
     *   static ngPipeDef = definePipe({
     *     ...
     *   });
     * }
     * ```
     * @template T
     * @param {?} __0
     * @return {?}
     */
    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * Create a pipe.
     *
     * @template T
     * @param {?} index Pipe index where the pipe will be stored.
     * @param {?} pipeDef Pipe definition object for registering life cycle hooks.
     * @param {?} pipe A Pipe instance.
     * @return {?}
     */
    /**
     * Invokes a pipe with 1 arguments.
     *
     * This instruction acts as a guard to {\@link PipeTransform#transform} invoking
     * the pipe only when an input to the pipe changes.
     *
     * @param {?} index Pipe index where the pipe was stored on creation.
     * @param {?} v1 1st argument to {\@link PipeTransform#transform}.
     * @return {?}
     */
    /**
     * Invokes a pipe with 2 arguments.
     *
     * This instruction acts as a guard to {\@link PipeTransform#transform} invoking
     * the pipe only when an input to the pipe changes.
     *
     * @param {?} index Pipe index where the pipe was stored on creation.
     * @param {?} v1 1st argument to {\@link PipeTransform#transform}.
     * @param {?} v2 2nd argument to {\@link PipeTransform#transform}.
     * @return {?}
     */
    /**
     * Invokes a pipe with 3 arguments.
     *
     * This instruction acts as a guard to {\@link PipeTransform#transform} invoking
     * the pipe only when an input to the pipe changes.
     *
     * @param {?} index Pipe index where the pipe was stored on creation.
     * @param {?} v1 1st argument to {\@link PipeTransform#transform}.
     * @param {?} v2 2nd argument to {\@link PipeTransform#transform}.
     * @param {?} v3 4rd argument to {\@link PipeTransform#transform}.
     * @return {?}
     */
    /**
     * Invokes a pipe with 4 arguments.
     *
     * This instruction acts as a guard to {\@link PipeTransform#transform} invoking
     * the pipe only when an input to the pipe changes.
     *
     * @param {?} index Pipe index where the pipe was stored on creation.
     * @param {?} v1 1st argument to {\@link PipeTransform#transform}.
     * @param {?} v2 2nd argument to {\@link PipeTransform#transform}.
     * @param {?} v3 3rd argument to {\@link PipeTransform#transform}.
     * @param {?} v4 4th argument to {\@link PipeTransform#transform}.
     * @return {?}
     */
    /**
     * Invokes a pipe with variable number of arguments.
     *
     * This instruction acts as a guard to {\@link PipeTransform#transform} invoking
     * the pipe only when an input to the pipe changes.
     *
     * @param {?} index Pipe index where the pipe was stored on creation.
     * @param {?} values Array of arguments to pass to {\@link PipeTransform#transform} method.
     * @return {?}
     */
    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * @record
     */
    /**
     * @record
     */
    /**
     * @record
     */
    /**
     * `DirectiveDef` is a compiled version of the Directive used by the renderer instructions.
     * @record
     */
    /**
     * @record
     */
    /**
     *
     * @record
     */
    /**
     * @record
     */
    /**
     * @record
     */
// Note: This hack is necessary so we don't erroneously get a circular dependency
// failure based on types.
    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * @record
     */
// Note: This hack is necessary so we don't erroneously get a circular dependency
// failure based on types.
    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * Used for tracking queries (e.g. ViewChild, ContentChild).
     * @record
     */
// Note: This hack is necessary so we don't erroneously get a circular dependency
// failure based on types.
    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * A predicate which determines if a given element/directive should be included in the query
     * results.
     * @record
     */
    /**
     * An object representing a query, which is a combination of:
     * - query predicate to determines if a given element/directive should be included in the query
     * - values collected based on a predicate
     * - `QueryList` to which collected values should be reported
     * @record
     */
    var QueryList_ = /*@__PURE__*/ (/*@__PURE__*/ function () {
        function QueryList_() {
            this.dirty = true;
            this.changes = new EventEmitter();
            this._values = [];
            /**
             * \@internal
             */
            this._valuesTree = [];
        }

        Object.defineProperty(QueryList_.prototype, "length", {
            get: /**
             * @return {?}
             */ function () {
                return this._values.length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(QueryList_.prototype, "first", {
            get: /**
             * @return {?}
             */ function () {
                var /** @type {?} */ values = this._values;
                return values.length ? values[0] : null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(QueryList_.prototype, "last", {
            get: /**
             * @return {?}
             */ function () {
                var /** @type {?} */ values = this._values;
                return values.length ? values[values.length - 1] : null;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * See
         * [Array.map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
         */
        /**
         * See
         * [Array.map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
         * @template U
         * @param {?} fn
         * @return {?}
         */
        QueryList_.prototype.map = /**
         * See
         * [Array.map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
         * @template U
         * @param {?} fn
         * @return {?}
         */
        function (fn) {
            return this._values.map(fn);
        };
        /**
         * See
         * [Array.filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
         */
        /**
         * See
         * [Array.filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
         * @param {?} fn
         * @return {?}
         */
        QueryList_.prototype.filter = /**
         * See
         * [Array.filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
         * @param {?} fn
         * @return {?}
         */
        function (fn) {
            return this._values.filter(fn);
        };
        /**
         * See
         * [Array.find](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find)
         */
        /**
         * See
         * [Array.find](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find)
         * @param {?} fn
         * @return {?}
         */
        QueryList_.prototype.find = /**
         * See
         * [Array.find](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find)
         * @param {?} fn
         * @return {?}
         */
        function (fn) {
            return this._values.find(fn);
        };
        /**
         * See
         * [Array.reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)
         */
        /**
         * See
         * [Array.reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)
         * @template U
         * @param {?} fn
         * @param {?} init
         * @return {?}
         */
        QueryList_.prototype.reduce = /**
         * See
         * [Array.reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)
         * @template U
         * @param {?} fn
         * @param {?} init
         * @return {?}
         */
        function (fn, init) {
            return this._values.reduce(fn, init);
        };
        /**
         * See
         * [Array.forEach](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)
         */
        /**
         * See
         * [Array.forEach](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)
         * @param {?} fn
         * @return {?}
         */
        QueryList_.prototype.forEach = /**
         * See
         * [Array.forEach](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)
         * @param {?} fn
         * @return {?}
         */
        function (fn) {
            this._values.forEach(fn);
        };
        /**
         * See
         * [Array.some](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some)
         */
        /**
         * See
         * [Array.some](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some)
         * @param {?} fn
         * @return {?}
         */
        QueryList_.prototype.some = /**
         * See
         * [Array.some](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some)
         * @param {?} fn
         * @return {?}
         */
        function (fn) {
            return this._values.some(fn);
        };
        /**
         * @return {?}
         */
        QueryList_.prototype.toArray = /**
         * @return {?}
         */
        function () {
            return this._values.slice(0);
        };
        /**
         * @return {?}
         */
        QueryList_.prototype[getSymbolIterator()] = /**
         * @return {?}
         */
        function () {
            return ((this._values))[getSymbolIterator()]();
        };
        /**
         * @return {?}
         */
        QueryList_.prototype.toString = /**
         * @return {?}
         */
        function () {
            return this._values.toString();
        };
        /**
         * @param {?} res
         * @return {?}
         */
        QueryList_.prototype.reset = /**
         * @param {?} res
         * @return {?}
         */
        function (res) {
            this._values = flatten$1(res);
            ((this)).dirty = false;
        };
        /**
         * @return {?}
         */
        QueryList_.prototype.notifyOnChanges = /**
         * @return {?}
         */
        function () {
            ((this.changes)).emit(this);
        };
        /**
         * @return {?}
         */
        QueryList_.prototype.setDirty = /**
         * @return {?}
         */
        function () {
            ((this)).dirty = true;
        };
        /**
         * @return {?}
         */
        QueryList_.prototype.destroy = /**
         * @return {?}
         */
        function () {
            ((this.changes)).complete();
            ((this.changes)).unsubscribe();
        };
        return QueryList_;
    }());

    class HelloWorld {
        constructor() {
            this.name = 'World!';
            this.size = 20;
        }

        processClick() {
        }
    }

    HelloWorld.ngComponentDef = defineComponent({
        type: HelloWorld, tag: "hello-world",
        factory: function HelloWorld_Factory() {
            return new HelloWorld();
        },
        template: function HelloWorld_Template(ctx, cm) {
            if (cm) {
                elementStart(0, "h3");
                text(1);
                elementEnd();
            }
            elementProperty(0, "title", (ctx.name + "test"));
            textBinding(1, bind1("Hello ", (ctx.name + "test"), ""));
        }
    });
    var component = renderComponent(HelloWorld);
    setInterval(() => {
        component.name = "Size: " + component.size++;
    }, 500);

    exports.HelloWorld = HelloWorld;

    return exports;

}({}));
//# sourceMappingURL=bundle.js.map

(() => {
  // node_modules/govuk-frontend/govuk-esm/common/index.mjs
  function mergeConfigs() {
    var flattenObject = function(configObject) {
      var flattenedObject = {};
      var flattenLoop = function(obj2, prefix) {
        for (var key2 in obj2) {
          if (!Object.prototype.hasOwnProperty.call(obj2, key2)) {
            continue;
          }
          var value = obj2[key2];
          var prefixedKey = prefix ? prefix + "." + key2 : key2;
          if (typeof value === "object") {
            flattenLoop(value, prefixedKey);
          } else {
            flattenedObject[prefixedKey] = value;
          }
        }
      };
      flattenLoop(configObject);
      return flattenedObject;
    };
    var formattedConfigObject = {};
    for (var i = 0; i < arguments.length; i++) {
      var obj = flattenObject(arguments[i]);
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          formattedConfigObject[key] = obj[key];
        }
      }
    }
    return formattedConfigObject;
  }

  // node_modules/govuk-frontend/govuk-esm/vendor/polyfills/Object/defineProperty.mjs
  (function(undefined) {
    var detect = (
      // In IE8, defineProperty could only act on DOM elements, so full support
      // for the feature requires the ability to set a property on an arbitrary object
      "defineProperty" in Object && function() {
        try {
          var a = {};
          Object.defineProperty(a, "test", { value: 42 });
          return true;
        } catch (e) {
          return false;
        }
      }()
    );
    if (detect)
      return;
    (function(nativeDefineProperty) {
      var supportsAccessors = Object.prototype.hasOwnProperty("__defineGetter__");
      var ERR_ACCESSORS_NOT_SUPPORTED = "Getters & setters cannot be defined on this javascript engine";
      var ERR_VALUE_ACCESSORS = "A property cannot both have accessors and be writable or have a value";
      Object.defineProperty = function defineProperty(object, property, descriptor) {
        if (nativeDefineProperty && (object === window || object === document || object === Element.prototype || object instanceof Element)) {
          return nativeDefineProperty(object, property, descriptor);
        }
        if (object === null || !(object instanceof Object || typeof object === "object")) {
          throw new TypeError("Object.defineProperty called on non-object");
        }
        if (!(descriptor instanceof Object)) {
          throw new TypeError("Property description must be an object");
        }
        var propertyString = String(property);
        var hasValueOrWritable = "value" in descriptor || "writable" in descriptor;
        var getterType = "get" in descriptor && typeof descriptor.get;
        var setterType = "set" in descriptor && typeof descriptor.set;
        if (getterType) {
          if (getterType !== "function") {
            throw new TypeError("Getter must be a function");
          }
          if (!supportsAccessors) {
            throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
          }
          if (hasValueOrWritable) {
            throw new TypeError(ERR_VALUE_ACCESSORS);
          }
          Object.__defineGetter__.call(object, propertyString, descriptor.get);
        } else {
          object[propertyString] = descriptor.value;
        }
        if (setterType) {
          if (setterType !== "function") {
            throw new TypeError("Setter must be a function");
          }
          if (!supportsAccessors) {
            throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
          }
          if (hasValueOrWritable) {
            throw new TypeError(ERR_VALUE_ACCESSORS);
          }
          Object.__defineSetter__.call(object, propertyString, descriptor.set);
        }
        if ("value" in descriptor) {
          object[propertyString] = descriptor.value;
        }
        return object;
      };
    })(Object.defineProperty);
  }).call("object" === typeof window && window || "object" === typeof self && self || "object" === typeof global && global || {});

  // node_modules/govuk-frontend/govuk-esm/vendor/polyfills/Document.mjs
  (function(undefined) {
    var detect = "Document" in this;
    if (detect)
      return;
    if (typeof WorkerGlobalScope === "undefined" && typeof importScripts !== "function") {
      if (this.HTMLDocument) {
        this.Document = this.HTMLDocument;
      } else {
        this.Document = this.HTMLDocument = document.constructor = new Function("return function Document() {}")();
        this.Document.prototype = document;
      }
    }
  }).call("object" === typeof window && window || "object" === typeof self && self || "object" === typeof global && global || {});

  // node_modules/govuk-frontend/govuk-esm/vendor/polyfills/Element.mjs
  (function(undefined) {
    var detect = "Element" in this && "HTMLElement" in this;
    if (detect)
      return;
    (function() {
      if (window.Element && !window.HTMLElement) {
        window.HTMLElement = window.Element;
        return;
      }
      window.Element = window.HTMLElement = new Function("return function Element() {}")();
      var vbody = document.appendChild(document.createElement("body"));
      var frame = vbody.appendChild(document.createElement("iframe"));
      var frameDocument = frame.contentWindow.document;
      var prototype = Element.prototype = frameDocument.appendChild(frameDocument.createElement("*"));
      var cache = {};
      var shiv = function(element, deep) {
        var childNodes = element.childNodes || [], index = -1, key, value, childNode;
        if (element.nodeType === 1 && element.constructor !== Element) {
          element.constructor = Element;
          for (key in cache) {
            value = cache[key];
            element[key] = value;
          }
        }
        while (childNode = deep && childNodes[++index]) {
          shiv(childNode, deep);
        }
        return element;
      };
      var elements = document.getElementsByTagName("*");
      var nativeCreateElement = document.createElement;
      var interval;
      var loopLimit = 100;
      prototype.attachEvent("onpropertychange", function(event) {
        var propertyName = event.propertyName, nonValue = !cache.hasOwnProperty(propertyName), newValue = prototype[propertyName], oldValue = cache[propertyName], index = -1, element;
        while (element = elements[++index]) {
          if (element.nodeType === 1) {
            if (nonValue || element[propertyName] === oldValue) {
              element[propertyName] = newValue;
            }
          }
        }
        cache[propertyName] = newValue;
      });
      prototype.constructor = Element;
      if (!prototype.hasAttribute) {
        prototype.hasAttribute = function hasAttribute(name) {
          return this.getAttribute(name) !== null;
        };
      }
      function bodyCheck() {
        if (!loopLimit--)
          clearTimeout(interval);
        if (document.body && !document.body.prototype && /(complete|interactive)/.test(document.readyState)) {
          shiv(document, true);
          if (interval && document.body.prototype)
            clearTimeout(interval);
          return !!document.body.prototype;
        }
        return false;
      }
      if (!bodyCheck()) {
        document.onreadystatechange = bodyCheck;
        interval = setInterval(bodyCheck, 25);
      }
      document.createElement = function createElement(nodeName) {
        var element = nativeCreateElement(String(nodeName).toLowerCase());
        return shiv(element);
      };
      document.removeChild(vbody);
    })();
  }).call("object" === typeof window && window || "object" === typeof self && self || "object" === typeof global && global || {});

  // node_modules/govuk-frontend/govuk-esm/vendor/polyfills/Element/prototype/dataset.mjs
  (function(undefined) {
    var detect = function() {
      if (!document.documentElement.dataset) {
        return false;
      }
      var el = document.createElement("div");
      el.setAttribute("data-a-b", "c");
      return el.dataset && el.dataset.aB == "c";
    }();
    if (detect)
      return;
    Object.defineProperty(Element.prototype, "dataset", {
      get: function() {
        var element = this;
        var attributes = this.attributes;
        var map = {};
        for (var i = 0; i < attributes.length; i++) {
          var attribute = attributes[i];
          if (attribute && attribute.name && /^data-\w[.\w-]*$/.test(attribute.name)) {
            var name = attribute.name;
            var value = attribute.value;
            var propName = name.substr(5).replace(/-./g, function(prop) {
              return prop.charAt(1).toUpperCase();
            });
            if ("__defineGetter__" in Object.prototype && "__defineSetter__" in Object.prototype) {
              Object.defineProperty(map, propName, {
                enumerable: true,
                get: function() {
                  return this.value;
                }.bind({ value: value || "" }),
                set: function setter(name2, value2) {
                  if (typeof value2 !== "undefined") {
                    this.setAttribute(name2, value2);
                  } else {
                    this.removeAttribute(name2);
                  }
                }.bind(element, name)
              });
            } else {
              map[propName] = value;
            }
          }
        }
        return map;
      }
    });
  }).call("object" === typeof window && window || "object" === typeof self && self || "object" === typeof global && global || {});

  // node_modules/govuk-frontend/govuk-esm/vendor/polyfills/String/prototype/trim.mjs
  (function(undefined) {
    var detect = "trim" in String.prototype;
    if (detect)
      return;
    String.prototype.trim = function() {
      return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
    };
  }).call("object" === typeof window && window || "object" === typeof self && self || "object" === typeof global && global || {});

  // node_modules/govuk-frontend/govuk-esm/common/normalise-dataset.mjs
  function normaliseString(value) {
    if (typeof value !== "string") {
      return value;
    }
    var trimmedValue = value.trim();
    if (trimmedValue === "true") {
      return true;
    }
    if (trimmedValue === "false") {
      return false;
    }
    if (trimmedValue.length > 0 && isFinite(trimmedValue)) {
      return Number(trimmedValue);
    }
    return value;
  }
  function normaliseDataset(dataset) {
    var out = {};
    for (var key in dataset) {
      out[key] = normaliseString(dataset[key]);
    }
    return out;
  }

  // node_modules/govuk-frontend/govuk-esm/vendor/polyfills/Element/prototype/matches.mjs
  (function(undefined) {
    var detect = "document" in this && "matches" in document.documentElement;
    if (detect)
      return;
    Element.prototype.matches = Element.prototype.webkitMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.mozMatchesSelector || function matches(selector) {
      var element = this;
      var elements = (element.document || element.ownerDocument).querySelectorAll(selector);
      var index = 0;
      while (elements[index] && elements[index] !== element) {
        ++index;
      }
      return !!elements[index];
    };
  }).call("object" === typeof window && window || "object" === typeof self && self || "object" === typeof global && global || {});

  // node_modules/govuk-frontend/govuk-esm/vendor/polyfills/Element/prototype/closest.mjs
  (function(undefined) {
    var detect = "document" in this && "closest" in document.documentElement;
    if (detect)
      return;
    Element.prototype.closest = function closest(selector) {
      var node = this;
      while (node) {
        if (node.matches(selector))
          return node;
        else
          node = "SVGElement" in window && node instanceof SVGElement ? node.parentNode : node.parentElement;
      }
      return null;
    };
  }).call("object" === typeof window && window || "object" === typeof self && self || "object" === typeof global && global || {});

  // node_modules/govuk-frontend/govuk-esm/vendor/polyfills/Window.mjs
  (function(undefined) {
    var detect = "Window" in this;
    if (detect)
      return;
    if (typeof WorkerGlobalScope === "undefined" && typeof importScripts !== "function") {
      (function(global2) {
        if (global2.constructor) {
          global2.Window = global2.constructor;
        } else {
          (global2.Window = global2.constructor = new Function("return function Window() {}")()).prototype = this;
        }
      })(this);
    }
  }).call("object" === typeof window && window || "object" === typeof self && self || "object" === typeof global && global || {});

  // node_modules/govuk-frontend/govuk-esm/vendor/polyfills/Event.mjs
  (function(undefined) {
    var detect = function(global2) {
      if (!("Event" in global2))
        return false;
      if (typeof global2.Event === "function")
        return true;
      try {
        new Event("click");
        return true;
      } catch (e) {
        return false;
      }
    }(this);
    if (detect)
      return;
    (function() {
      var unlistenableWindowEvents = {
        click: 1,
        dblclick: 1,
        keyup: 1,
        keypress: 1,
        keydown: 1,
        mousedown: 1,
        mouseup: 1,
        mousemove: 1,
        mouseover: 1,
        mouseenter: 1,
        mouseleave: 1,
        mouseout: 1,
        storage: 1,
        storagecommit: 1,
        textinput: 1
      };
      if (typeof document === "undefined" || typeof window === "undefined")
        return;
      function indexOf(array, element) {
        var index = -1, length = array.length;
        while (++index < length) {
          if (index in array && array[index] === element) {
            return index;
          }
        }
        return -1;
      }
      var existingProto = window.Event && window.Event.prototype || null;
      window.Event = Window.prototype.Event = function Event2(type, eventInitDict) {
        if (!type) {
          throw new Error("Not enough arguments");
        }
        var event;
        if ("createEvent" in document) {
          event = document.createEvent("Event");
          var bubbles = eventInitDict && eventInitDict.bubbles !== undefined ? eventInitDict.bubbles : false;
          var cancelable = eventInitDict && eventInitDict.cancelable !== undefined ? eventInitDict.cancelable : false;
          event.initEvent(type, bubbles, cancelable);
          return event;
        }
        event = document.createEventObject();
        event.type = type;
        event.bubbles = eventInitDict && eventInitDict.bubbles !== undefined ? eventInitDict.bubbles : false;
        event.cancelable = eventInitDict && eventInitDict.cancelable !== undefined ? eventInitDict.cancelable : false;
        return event;
      };
      if (existingProto) {
        Object.defineProperty(window.Event, "prototype", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: existingProto
        });
      }
      if (!("createEvent" in document)) {
        window.addEventListener = Window.prototype.addEventListener = Document.prototype.addEventListener = Element.prototype.addEventListener = function addEventListener() {
          var element = this, type = arguments[0], listener = arguments[1];
          if (element === window && type in unlistenableWindowEvents) {
            throw new Error("In IE8 the event: " + type + " is not available on the window object. Please see https://github.com/Financial-Times/polyfill-service/issues/317 for more information.");
          }
          if (!element._events) {
            element._events = {};
          }
          if (!element._events[type]) {
            element._events[type] = function(event) {
              var list = element._events[event.type].list, events = list.slice(), index = -1, length = events.length, eventElement;
              event.preventDefault = function preventDefault() {
                if (event.cancelable !== false) {
                  event.returnValue = false;
                }
              };
              event.stopPropagation = function stopPropagation() {
                event.cancelBubble = true;
              };
              event.stopImmediatePropagation = function stopImmediatePropagation() {
                event.cancelBubble = true;
                event.cancelImmediate = true;
              };
              event.currentTarget = element;
              event.relatedTarget = event.fromElement || null;
              event.target = event.target || event.srcElement || element;
              event.timeStamp = (/* @__PURE__ */ new Date()).getTime();
              if (event.clientX) {
                event.pageX = event.clientX + document.documentElement.scrollLeft;
                event.pageY = event.clientY + document.documentElement.scrollTop;
              }
              while (++index < length && !event.cancelImmediate) {
                if (index in events) {
                  eventElement = events[index];
                  if (indexOf(list, eventElement) !== -1 && typeof eventElement === "function") {
                    eventElement.call(element, event);
                  }
                }
              }
            };
            element._events[type].list = [];
            if (element.attachEvent) {
              element.attachEvent("on" + type, element._events[type]);
            }
          }
          element._events[type].list.push(listener);
        };
        window.removeEventListener = Window.prototype.removeEventListener = Document.prototype.removeEventListener = Element.prototype.removeEventListener = function removeEventListener() {
          var element = this, type = arguments[0], listener = arguments[1], index;
          if (element._events && element._events[type] && element._events[type].list) {
            index = indexOf(element._events[type].list, listener);
            if (index !== -1) {
              element._events[type].list.splice(index, 1);
              if (!element._events[type].list.length) {
                if (element.detachEvent) {
                  element.detachEvent("on" + type, element._events[type]);
                }
                delete element._events[type];
              }
            }
          }
        };
        window.dispatchEvent = Window.prototype.dispatchEvent = Document.prototype.dispatchEvent = Element.prototype.dispatchEvent = function dispatchEvent(event) {
          if (!arguments.length) {
            throw new Error("Not enough arguments");
          }
          if (!event || typeof event.type !== "string") {
            throw new Error("DOM Events Exception 0");
          }
          var element = this, type = event.type;
          try {
            if (!event.bubbles) {
              event.cancelBubble = true;
              var cancelBubbleEvent = function(event2) {
                event2.cancelBubble = true;
                (element || window).detachEvent("on" + type, cancelBubbleEvent);
              };
              this.attachEvent("on" + type, cancelBubbleEvent);
            }
            this.fireEvent("on" + type, event);
          } catch (error) {
            event.target = element;
            do {
              event.currentTarget = element;
              if ("_events" in element && typeof element._events[type] === "function") {
                element._events[type].call(element, event);
              }
              if (typeof element["on" + type] === "function") {
                element["on" + type].call(element, event);
              }
              element = element.nodeType === 9 ? element.parentWindow : element.parentNode;
            } while (element && !event.cancelBubble);
          }
          return true;
        };
        document.attachEvent("onreadystatechange", function() {
          if (document.readyState === "complete") {
            document.dispatchEvent(new Event("DOMContentLoaded", {
              bubbles: true
            }));
          }
        });
      }
    })();
  }).call("object" === typeof window && window || "object" === typeof self && self || "object" === typeof global && global || {});

  // node_modules/govuk-frontend/govuk-esm/vendor/polyfills/Function/prototype/bind.mjs
  (function(undefined) {
    var detect = "bind" in Function.prototype;
    if (detect)
      return;
    Object.defineProperty(Function.prototype, "bind", {
      value: function bind(that) {
        var $Array = Array;
        var $Object = Object;
        var ObjectPrototype = $Object.prototype;
        var ArrayPrototype = $Array.prototype;
        var Empty = function Empty2() {
        };
        var to_string = ObjectPrototype.toString;
        var hasToStringTag = typeof Symbol === "function" && typeof Symbol.toStringTag === "symbol";
        var isCallable;
        var fnToStr = Function.prototype.toString, tryFunctionObject = function tryFunctionObject2(value) {
          try {
            fnToStr.call(value);
            return true;
          } catch (e) {
            return false;
          }
        }, fnClass = "[object Function]", genClass = "[object GeneratorFunction]";
        isCallable = function isCallable2(value) {
          if (typeof value !== "function") {
            return false;
          }
          if (hasToStringTag) {
            return tryFunctionObject(value);
          }
          var strClass = to_string.call(value);
          return strClass === fnClass || strClass === genClass;
        };
        var array_slice = ArrayPrototype.slice;
        var array_concat = ArrayPrototype.concat;
        var array_push = ArrayPrototype.push;
        var max = Math.max;
        var target = this;
        if (!isCallable(target)) {
          throw new TypeError("Function.prototype.bind called on incompatible " + target);
        }
        var args = array_slice.call(arguments, 1);
        var bound;
        var binder = function() {
          if (this instanceof bound) {
            var result = target.apply(
              this,
              array_concat.call(args, array_slice.call(arguments))
            );
            if ($Object(result) === result) {
              return result;
            }
            return this;
          } else {
            return target.apply(
              that,
              array_concat.call(args, array_slice.call(arguments))
            );
          }
        };
        var boundLength = max(0, target.length - args.length);
        var boundArgs = [];
        for (var i = 0; i < boundLength; i++) {
          array_push.call(boundArgs, "$" + i);
        }
        bound = Function("binder", "return function (" + boundArgs.join(",") + "){ return binder.apply(this, arguments); }")(binder);
        if (target.prototype) {
          Empty.prototype = target.prototype;
          bound.prototype = new Empty();
          Empty.prototype = null;
        }
        return bound;
      }
    });
  }).call("object" === typeof window && window || "object" === typeof self && self || "object" === typeof global && global || {});

  // node_modules/govuk-frontend/govuk-esm/components/error-summary/error-summary.mjs
  function ErrorSummary($module, config) {
    if (!$module) {
      return this;
    }
    this.$module = $module;
    var defaultConfig = {
      disableAutoFocus: false
    };
    this.config = mergeConfigs(
      defaultConfig,
      config || {},
      normaliseDataset($module.dataset)
    );
  }
  ErrorSummary.prototype.init = function() {
    var $module = this.$module;
    if (!$module) {
      return;
    }
    this.setFocus();
    $module.addEventListener("click", this.handleClick.bind(this));
  };
  ErrorSummary.prototype.setFocus = function() {
    var $module = this.$module;
    if (this.config.disableAutoFocus) {
      return;
    }
    $module.setAttribute("tabindex", "-1");
    $module.addEventListener("blur", function() {
      $module.removeAttribute("tabindex");
    });
    $module.focus();
  };
  ErrorSummary.prototype.handleClick = function(event) {
    var $target = event.target;
    if (this.focusTarget($target)) {
      event.preventDefault();
    }
  };
  ErrorSummary.prototype.focusTarget = function($target) {
    if ($target.tagName !== "A" || $target.href === false) {
      return false;
    }
    var inputId = this.getFragmentFromUrl($target.href);
    var $input = document.getElementById(inputId);
    if (!$input) {
      return false;
    }
    var $legendOrLabel = this.getAssociatedLegendOrLabel($input);
    if (!$legendOrLabel) {
      return false;
    }
    $legendOrLabel.scrollIntoView();
    $input.focus({ preventScroll: true });
    return true;
  };
  ErrorSummary.prototype.getFragmentFromUrl = function(url) {
    if (url.indexOf("#") === -1) {
      return false;
    }
    return url.split("#").pop();
  };
  ErrorSummary.prototype.getAssociatedLegendOrLabel = function($input) {
    var $fieldset = $input.closest("fieldset");
    if ($fieldset) {
      var $legends = $fieldset.getElementsByTagName("legend");
      if ($legends.length) {
        var $candidateLegend = $legends[0];
        if ($input.type === "checkbox" || $input.type === "radio") {
          return $candidateLegend;
        }
        var legendTop = $candidateLegend.getBoundingClientRect().top;
        var inputRect = $input.getBoundingClientRect();
        if (inputRect.height && window.innerHeight) {
          var inputBottom = inputRect.top + inputRect.height;
          if (inputBottom - legendTop < window.innerHeight / 2) {
            return $candidateLegend;
          }
        }
      }
    }
    return document.querySelector("label[for='" + $input.getAttribute("id") + "']") || $input.closest("label");
  };
  var error_summary_default = ErrorSummary;

  // app/javascript/error-summary.js
  var Component = error_summary_default;
  var error_summary_default2 = Component;
})();
//# sourceMappingURL=assets/error-summary.js.map

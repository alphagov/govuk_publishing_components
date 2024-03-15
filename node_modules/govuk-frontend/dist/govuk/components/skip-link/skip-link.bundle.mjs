function getFragmentFromUrl(url) {
  if (!url.includes('#')) {
    return undefined;
  }
  return url.split('#').pop();
}
function isSupported($scope = document.body) {
  if (!$scope) {
    return false;
  }
  return $scope.classList.contains('govuk-frontend-supported');
}

/**
 * Schema for component config
 *
 * @typedef {object} Schema
 * @property {SchemaCondition[]} [anyOf] - List of schema conditions
 */

/**
 * Schema condition for component config
 *
 * @typedef {object} SchemaCondition
 * @property {string[]} required - List of required config fields
 * @property {string} errorMessage - Error message when required config fields not provided
 */

class GOVUKFrontendError extends Error {
  constructor(...args) {
    super(...args);
    this.name = 'GOVUKFrontendError';
  }
}
class SupportError extends GOVUKFrontendError {
  /**
   * Checks if GOV.UK Frontend is supported on this page
   *
   * @param {HTMLElement | null} [$scope] - HTML element `<body>` checked for browser support
   */
  constructor($scope = document.body) {
    const supportMessage = 'noModule' in HTMLScriptElement.prototype ? 'GOV.UK Frontend initialised without `<body class="govuk-frontend-supported">` from template `<script>` snippet' : 'GOV.UK Frontend is not supported in this browser';
    super($scope ? supportMessage : 'GOV.UK Frontend initialised without `<script type="module">`');
    this.name = 'SupportError';
  }
}
class ElementError extends GOVUKFrontendError {
  constructor(messageOrOptions) {
    let message = typeof messageOrOptions === 'string' ? messageOrOptions : '';
    if (typeof messageOrOptions === 'object') {
      const {
        componentName,
        identifier,
        element,
        expectedType
      } = messageOrOptions;
      message = `${componentName}: ${identifier}`;
      message += element ? ` is not of type ${expectedType != null ? expectedType : 'HTMLElement'}` : ' not found';
    }
    super(message);
    this.name = 'ElementError';
  }
}

class GOVUKFrontendComponent {
  constructor() {
    this.checkSupport();
  }
  checkSupport() {
    if (!isSupported()) {
      throw new SupportError();
    }
  }
}

/**
 * Skip link component
 *
 * @preserve
 */
class SkipLink extends GOVUKFrontendComponent {
  /**
   * @param {Element | null} $module - HTML element to use for skip link
   * @throws {ElementError} when $module is not set or the wrong type
   * @throws {ElementError} when $module.hash does not contain a hash
   * @throws {ElementError} when the linked element is missing or the wrong type
   */
  constructor($module) {
    var _this$$module$getAttr;
    super();
    this.$module = void 0;
    this.$linkedElement = void 0;
    this.linkedElementListener = false;
    if (!($module instanceof HTMLAnchorElement)) {
      throw new ElementError({
        componentName: 'Skip link',
        element: $module,
        expectedType: 'HTMLAnchorElement',
        identifier: 'Root element (`$module`)'
      });
    }
    this.$module = $module;
    const hash = this.$module.hash;
    const href = (_this$$module$getAttr = this.$module.getAttribute('href')) != null ? _this$$module$getAttr : '';
    let url;
    try {
      url = new window.URL(this.$module.href);
    } catch (error) {
      throw new ElementError(`Skip link: Target link (\`href="${href}"\`) is invalid`);
    }
    if (url.origin !== window.location.origin || url.pathname !== window.location.pathname) {
      return;
    }
    const linkedElementId = getFragmentFromUrl(hash);
    if (!linkedElementId) {
      throw new ElementError(`Skip link: Target link (\`href="${href}"\`) has no hash fragment`);
    }
    const $linkedElement = document.getElementById(linkedElementId);
    if (!$linkedElement) {
      throw new ElementError({
        componentName: 'Skip link',
        element: $linkedElement,
        identifier: `Target content (\`id="${linkedElementId}"\`)`
      });
    }
    this.$linkedElement = $linkedElement;
    this.$module.addEventListener('click', () => this.focusLinkedElement());
  }
  focusLinkedElement() {
    if (!this.$linkedElement) {
      return;
    }
    if (!this.$linkedElement.getAttribute('tabindex')) {
      this.$linkedElement.setAttribute('tabindex', '-1');
      this.$linkedElement.classList.add('govuk-skip-link-focused-element');
      if (!this.linkedElementListener) {
        this.$linkedElement.addEventListener('blur', () => this.removeFocusProperties());
        this.linkedElementListener = true;
      }
    }
    this.$linkedElement.focus();
  }
  removeFocusProperties() {
    if (!this.$linkedElement) {
      return;
    }
    this.$linkedElement.removeAttribute('tabindex');
    this.$linkedElement.classList.remove('govuk-skip-link-focused-element');
  }
}
SkipLink.moduleName = 'govuk-skip-link';

export { SkipLink };
//# sourceMappingURL=skip-link.bundle.mjs.map

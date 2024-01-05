/* eslint-env browser, jasmine */

window._jasmine_loadEsModule = function(src) {
  const script = document.createElement('script');
  script.type = 'module';

  // Safari reports syntax errors in ES modules as a script element error
  // event rather than a global error event. Rethrow so that Jasmine can
  // pick it up and fail the suite.
  script.addEventListener('error', function(event) {
    const msg =
      'An error occurred while loading ' +
      src +
      '. Check the browser console for details.';
    throw new Error(msg);
  });

  script.src = src;
  document.head.appendChild(script);
};

window._jasmine_loadWithTopLevelAwaitSupport = async function(
  scriptUrls,
  esmFilenameExtension
) {
  const scriptsLoaded = (async function() {
    // Load scripts sequentially to ensure that users can get a stable order
    // by disabling randomization or setting a seed. This can be considerably
    // slower than the normal way of doing things because the browser won't
    // parallelize the HTTP requests. But it's the only way to ensure that the
    // describes will execute in a consistent order in the presence of top-level
    // await.
    for (const url of scriptUrls) {
      const isEsm = url.endsWith(esmFilenameExtension);

      if (isEsm) {
        try {
          await import(url);
        } catch (e) {
          setTimeout(function() {
            // Rethrow the error so jasmine-core's global error handler can pick it up.
            throw e;
          });
          await new Promise(function(resolve) {
            setTimeout(resolve);
          });
        }
      } else {
        await new Promise(function(resolve) {
          const script = document.createElement('script');
          script.addEventListener('load', function() {
            resolve();
          });
          script.addEventListener('error', function() {
            resolve();
          });
          script.src = url;
          document.head.appendChild(script);
        });
      }
    }
  })();

  const bootJasmine = window.onload;
  window.onload = function() {
    scriptsLoaded.then(bootJasmine);
  };
};

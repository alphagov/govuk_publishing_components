# Sprockets is not aware of the `.mjs` extension, so we need to let it know that it's JavaScript
# This required to completely re-register the 'application/javascript' MIME type
Sprockets.register_mime_type 'application/javascript', extensions: ['.js', '.mjs'], charset: :unicode
# Unfortunately, this seemed to break when an edit was made to `application.js`
# Sprockets.mime_types['application/javascript'][:extensions] << '.mjs'
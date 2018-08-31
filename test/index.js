import 'Components/App'

// require all tests
const testsContext = require.context('.', true, /.test\.js$/);
testsContext.keys().forEach(testsContext);

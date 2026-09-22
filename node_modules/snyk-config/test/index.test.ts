import { loadConfig } from '../lib';
import * as path from 'path';

describe('snyk-config', () => {
  beforeAll(() => {
    removeSnykKeysFromEnv();
    removeConfigKeysFromEnv();
  });

  afterEach(() => {
    removeSnykKeysFromEnv();
    removeConfigKeysFromEnv();
  });

  it('can be called twice, on different config files', () => {
    const config = loadConfig(__dirname + '/fixtures/one');
    expect(config.foo).toEqual(1);
    expect(config.bar).toEqual(2);

    const config2 = loadConfig(__dirname + '/fixtures/two');
    expect(config2.foo).toEqual(10);
    expect(config2.bar).toEqual(20);
  });

  it('overrides env values', () => {
    process.env.SNYK_foo = '100';
    process.env.SNYK_bar__foo = '200';
    process.env.SNYK_complex__colour = 'red';
    process.env.SNYK_complex__fruit = 'apple';
    process.env.SNYK_complex__nested__colour = 'purple';
    process.env.SNYK_complex__nested__nested__fruit = 'banana';
    const config = loadConfig(__dirname + '/fixtures/one');

    expect(config.foo).toEqual('100');
    expect(config.bar).toEqual({ foo: '200' });
    expect(config.complex).toEqual({
      animal: 'dog',
      colour: 'red',
      fruit: 'apple',
      nested: {
        animal: 'cat',
        colour: 'purple',
        nested: {
          fruit: 'banana',
        },
      },
    });
  });

  it('gives priority to secret config over local and default', () => {
    const config = loadConfig(__dirname + '/fixtures/three', {
      secretConfig: __dirname + '/fixtures/three/config.secret.json',
    });

    expect(config.foo).toEqual(111);
    expect(config.bar).toEqual(42);
    expect(config.baz).toEqual({ key1: 'value1', key2: 'value2' });
  });

  it('can be called with a directory path', () => {
    const config = loadConfig(__dirname);

    expect(config).toBeDefined();
  });

  it('converts string representations of booleans to booleans', () => {
    process.env.SNYK_foo = 'TRUE';
    process.env.SNYK_bar = 'FALSE';
    process.env.SNYK_baz = 'true';
    process.env.SNYK_zoo = 'false';

    const config = loadConfig(__dirname + '/fixtures/one');

    expect(config.foo).toEqual(true);
    expect(config.bar).toEqual(false);
    expect(config.baz).toEqual(true);
    expect(config.zoo).toEqual(false);
  });

  it('arg truthy correctly parsed', () => {
    setArgv('--afoo', '--azoo=true');

    const config = loadConfig(__dirname + '/fixtures/one');

    expect(config.afoo).toEqual(true);
    expect(config.abar).toBeUndefined();
    expect(config.azoo).toEqual('true');
  });

  it('parses keyword args with and without an equals', () => {
    setArgv('--afoo=first-value', '--afoo=second-value');

    let config = loadConfig(__dirname + '/fixture/one');

    expect(config.afoo).toEqual(['first-value', 'second-value']);

    setArgv('--afoo', 'first-value', '--afoo', 'second-value');

    config = loadConfig(__dirname + '/fixture/one');

    expect(config.afoo).toEqual(['first-value', 'second-value']);
  });

  it('parses snyk specific args with SNYK_ prefix', () => {
    setArgv('--snyk_foo', '--SNYK_bar', '--SNYK_BAZ', '--SNYK_foo__bar');

    const config = loadConfig(__dirname + '/fixture/one');

    // --snyk_foo
    expect(config.foo).toBeUndefined();
    expect(config.snyk_foo).toEqual(true);

    // --SNYK_bar
    expect(config.snyk_bar).toEqual(undefined);
    expect(config.bar).toEqual(true);

    // --SNYK_BAZ
    expect(config.SNYK_BAZ).toBeUndefined();
    expect(config.snyk_baz).toBeUndefined();
    expect(config.BAZ).toEqual(true);
    expect(config.foo__bar).toEqual(true);
  });

  it('does not parse JSON strings', () => {
    setArgv('--json', JSON.stringify({ hello: 'world' }));

    const config = loadConfig(__dirname + '/fixture/one');

    expect(config.json).toEqual(expect.any(String));
  });

  it('does not modify whitespace in args', () => {
    setArgv('--abar=   new-value');

    let config = loadConfig(__dirname + '/fixture/one');

    expect(config.abar).toEqual('   new-value');

    setArgv('--abar=', '   new-value');

    config = loadConfig(__dirname + '/fixture/one');

    expect(config.abar).toEqual('');
    expect(config._).toEqual(['   new-value']);
  });

  it('stores numbers in keyword args as numbers', () => {
    setArgv('--abar', '1');
    let config = loadConfig(__dirname + '/fixture/one');

    expect(config.abar).toEqual(1);

    setArgv('--abar=0');
    config = loadConfig(__dirname + '/fixture/one');

    expect(config.abar).toEqual(0);

    setArgv('--abar=1');
    config = loadConfig(__dirname + '/fixture/one');

    expect(config.abar).toEqual(1);

    setArgv('--abar=-1');
    config = loadConfig(__dirname + '/fixture/one');

    expect(config.abar).toEqual(-1);

    setArgv('--abar=-1.55');
    config = loadConfig(__dirname + '/fixture/one');

    expect(config.abar).toEqual(-1.55);

    setArgv('--abar=.66');
    config = loadConfig(__dirname + '/fixture/one');

    expect(config.abar).toEqual(0.66);
  });

  it('sets keyword args with a "--no-" prefix to false', () => {
    setArgv('--no-bar');

    let config = loadConfig(__dirname + '/fixture/one');
    expect(config.bar).toEqual(false);
  });

  it('throws an error if an expected environment value is not present when loading config', () => {
    expect(() => loadConfig(__dirname + '/fixtures/env')).toThrow();
  });

  it('supports substituting config values with environment variables', () => {
    const testFixtureValue = 'a fixture value';
    process.env.CONFIG_TEST_VALUE = testFixtureValue;

    const config = loadConfig(__dirname + '/fixtures/env');
    const sourceData = require('./fixtures/env/config.default.json');

    expect(config.regular).toEqual(sourceData.regular);

    let replacedValue = sourceData.nested.toBeReplaced.replace(
      /\${CONFIG_TEST_VALUE}/g,
      testFixtureValue,
    );
    expect((config.nested as any).toBeReplaced).toEqual(replacedValue);

    replacedValue = sourceData.toBeReplaced.replace(
      /\${CONFIG_TEST_VALUE}/g,
      testFixtureValue,
    );
    expect(config.toBeReplaced).toEqual(replacedValue);
  });

  it('supports env overrides for which files to read', () => {
    const servEnv = __dirname + '/fixtures/serv-env';
    process.env.SERVICE_ENV = 'foo';
    process.env.CONFIG_SECRET_FILE = path.resolve(
      servEnv,
      'config.super-secret.json',
    );
    const config = loadConfig(servEnv);

    expect(config.secret).toEqual(42);
    expect(config.source).toEqual('from-foo');
  });

  it('can override an int with a string, when the same key is used in different levels of the config hierarchy', () => {
    const config = loadConfig(__dirname + '/fixtures/type-change');

    expect(config.foo).toEqual('bar');
  });

  it('does not parse array values from env vars', () => {
    const testArr = [1, 2, 3];
    const testArrStr = JSON.stringify(testArr);

    process.env.SNYK_TEST_ARR = testArrStr;

    const config = loadConfig(__dirname + '/fixtures/one');

    expect(config.TEST_ARR).toEqual(testArrStr);
  });

  describe.each`
    optionsVal   | envVal     | isParseExpected
    ${true}      | ${'true'}  | ${true}
    ${true}      | ${'false'} | ${true}
    ${true}      | ${''}      | ${true}
    ${false}     | ${'true'}  | ${false}
    ${false}     | ${'false'} | ${false}
    ${false}     | ${''}      | ${false}
    ${undefined} | ${'true'}  | ${true}
    ${undefined} | ${'false'} | ${false}
    ${undefined} | ${''}      | ${false}
  `(
    `when \`options.parseEnvValues\` is set to \`$optionsVal\` and \`CONFIG_PARSE_ENV_VALUES\` is set to \"$envVal"\``,
    ({ optionsVal, envVal, isParseExpected }) => {
      it(`${
        isParseExpected ? 'parses' : 'does not parse'
      } array values from env vars`, () => {
        const testArr = [1, 2, 3];
        const testArrStr = JSON.stringify(testArr);

        process.env.CONFIG_PARSE_ENV_VALUES = envVal;
        process.env.SNYK_TEST_ARR = testArrStr;

        const config = loadConfig(__dirname + '/fixtures/one', {
          parseEnvValues: optionsVal,
        });

        expect(config.TEST_ARR).toEqual(isParseExpected ? testArr : testArrStr);
      });

      it('JSON-unparsable values are not parsed', () => {
        const testInvalidArrStr = '[1,]';
        const expectedVal = testInvalidArrStr;

        process.env.CONFIG_PARSE_ENV_VALUES = envVal;
        process.env.SNYK_TEST_ARR = testInvalidArrStr;

        const config = loadConfig(__dirname + '/fixtures/one', {
          parseEnvValues: optionsVal,
        });

        expect(config.TEST_ARR).toEqual(expectedVal);
      });
    },
  );

  describe('when `options.parseEnvValues` is set to a non-boolean value and `CONFIG_PARSE_ENV_VALUES` is set to `"true"`', () => {
    it('throws an error', () => {
      process.env.CONFIG_PARSE_ENV_VALUES = 'true';

      expect(() =>
        loadConfig(__dirname + '/fixtures/one', {
          parseEnvValues: [] as any,
        }),
      ).toThrowError('options.parseEnvValues must be a boolean');
    });
  });

  describe('when `options.parseEnvValues` is set to `true` and `CONFIG_PARSE_ENV_VALUES` is set to a non-boolean value', () => {
    it('parses array values from env vars', () => {
      const testArr = [1, 2, 3];
      const testArrStr = JSON.stringify(testArr);

      process.env.CONFIG_PARSE_ENV_VALUES = '$$$';
      process.env.SNYK_TEST_ARR = testArrStr;

      const config = loadConfig(__dirname + '/fixtures/one', {
        parseEnvValues: true,
      });

      expect(config.TEST_ARR).toEqual(testArr);
    });
  });

  describe('when `options.parseEnvValues` is set to `false` and `CONFIG_PARSE_ENV_VALUES` is set to a non-boolean value', () => {
    it('does not parse array values from env vars', () => {
      const testArr = [1, 2, 3];
      const testArrStr = JSON.stringify(testArr);

      process.env.CONFIG_PARSE_ENV_VALUES = '$$$';
      process.env.SNYK_TEST_ARR = testArrStr;

      const config = loadConfig(__dirname + '/fixtures/one', {
        parseEnvValues: false,
      });

      expect(config.TEST_ARR).toEqual(testArrStr);
    });
  });

  describe('when `options.parseEnvValues` is not set and `CONFIG_PARSE_ENV_VALUES` is set to a non-boolean', () => {
    it('throws an error', () => {
      process.env.CONFIG_PARSE_ENV_VALUES = 3 as any;

      expect(() => loadConfig(__dirname + '/fixtures/one')).toThrowError(
        'CONFIG_PARSE_ENV_VALUES must be a boolean',
      );
    });
  });
});

function setArgv(...argv: string[]) {
  process.argv.length = 2;
  process.argv.push(...argv);
}

function removeSnykKeysFromEnv() {
  Object.keys(process.env).forEach((envKey) => {
    if (envKey.includes('SNYK')) {
      delete process.env[envKey];
    }
  });

  delete process.env.SERVICE_ENV;
  delete process.env.CONFIG_SECRET_FILE;
  delete process.env.CONFIG_TEST_VALUE;
}

function removeConfigKeysFromEnv() {
  Object.keys(process.env).forEach((envKey) => {
    if (envKey.startsWith('CONFIG')) {
      delete process.env[envKey];
    }
  });
}

const PREFIX = "[LEChO]";

const logger = {
    trace: (...params) => console.debug(PREFIX, ...params),
    debug: (...params) => console.debug(PREFIX, ...params),
    info: (...params) => console.log(PREFIX, ...params),
    warn: (...params) => console.warn(PREFIX, ...params),
    error: (...params) => console.error(PREFIX, ...params),

    time: (label) => console.time(`${PREFIX}: ${label}`),
    timeEnd: (label) => console.timeEnd(`${PREFIX}: ${label}`),
    assert: (...params) => console.assert(PREFIX, ...params),
    group: (label) => console.groupCollapsed(`${PREFIX}: ${label}`),
    groupEnd: (label) => console.groupEnd(`${PREFIX}: ${label}`),
};

const randomId = () => (37e16 * Math.random() + 37e16).toString(32);
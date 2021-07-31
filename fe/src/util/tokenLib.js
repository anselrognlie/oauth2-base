const addToken = (token, opts) => {
    if (! opts) {
        opts = {};
    }

    if (! opts.headers) {
        opts.headers = {};
    }

    opts.headers['Authorization'] = `JWT ${token}`;

    return opts;
};

export { addToken };
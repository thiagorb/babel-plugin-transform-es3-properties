const babel = require('babel-core');

const transformPromise = src => new Promise((resolve, reject) => babel
    .transformFile(
        src,
        {
            plugins: [__dirname]
        },
        (err, result) => {
            if (err) {
                return reject(err);
            }

            resolve(result.code);
        }
    )
);


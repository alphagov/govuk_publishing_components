/** Run a function each element in an array, with some level of concurrency.
 *
 * Defaults to a small, finite concurrency, so as to not to "overload" the database
 * connection pool or the http client, both of which have small, internal limits.
 *
 * Can be used with async functions that don't yield; will yield for you, if necessary.
 */
export declare function cMap<F, T>(input: Iterable<F>, mapper: (from: F) => Promise<T>, options?: {
    concurrency: number;
}): Promise<T[]>;

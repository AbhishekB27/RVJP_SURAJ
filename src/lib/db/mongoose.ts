import mongoose, { type Mongoose } from 'mongoose';

/**
 * One MongoDB connection per process, reused across every request.
 *
 * Two things make this less trivial than it looks:
 *
 *  1. `next dev` re-evaluates modules on hot reload, so a module-level
 *     `let cached` resets and we would open a fresh connection on every save
 *     until Atlas refuses new ones. Hanging the cache off `globalThis`
 *     survives that, because the global object is not re-created.
 *
 *  2. Requests arrive concurrently. Caching only the resolved connection
 *     still lets N in-flight requests each start their own `connect()`, so we
 *     cache the *promise* and let everyone await the same one.
 */

interface MongooseCache {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}

// `var` is deliberate: `globalThis` augmentation does not work with let/const.
declare global {
    var _mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = globalThis._mongoose ?? { conn: null, promise: null };
globalThis._mongoose = cached;

export async function connectToDatabase(): Promise<Mongoose> {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        // Read the env var here rather than at module scope — at module scope it
        // is evaluated at build time, when the variable may not be present.
        const uri = process.env.MONGODB_URI;

        if (!uri) {
            throw new Error(
                'MONGODB_URI is not set. Add it to .env.local and restart the dev server.',
            );
        }

        cached.promise = mongoose.connect(uri, {
            // Fail fast instead of queueing a query forever when the connection
            // is down — a silently hanging form submit is the worst outcome.
            bufferCommands: false,
            serverSelectionTimeoutMS: 10_000,
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        // Without this the rejected promise stays cached and *every* later
        // request reuses the same failure, so a blip becomes permanent.
        cached.promise = null;
        throw error;
    }

    return cached.conn;
}

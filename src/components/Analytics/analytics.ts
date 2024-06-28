import { redis } from "./redis";
import { getDate } from "./Analytics";
//import { parse } from "date-fns"

type AnalyticsArgs = {
  retention?: number;
};
type TrackOptions = {
  persist?: boolean;
};
export class Analytics {
  private retention: number = 60 * 60 * 24 * 7;

  constructor(opts?: AnalyticsArgs) {
    if (opts?.retention) this.retention = opts.retention;
  }

  async track(namespace: string, event: object = {}, opts?: TrackOptions) {
    let key = `analytics::${namespace}`;

    if (!opts?.persist) {
      key += `::${getDate()}`;
    }

    //db call to persist this event
    await redis.hincrby(key, JSON.stringify(event), 1);
    if (opts?.persist) await redis.expire(key, this.retention);
  }
  async retreive(namespace: string, date: string) {
    const res = await redis.hgetall<Record<string, string>>(
      `analytics::${namespace}::${date}`,
    );

    return {
      date,
      events: Object.entries(res ?? []).map(([key, value]) => ({
        [key]: Number(value),
      })),
    };
  }

  async retreiveDays(namespace: string, nDays: number) {
    type AnalyticsPromise = ReturnType<typeof analytics.retreive>;
    const promises: AnalyticsPromise[] = [];
    for (let i = 0; i < nDays; i++) {
      const formatteddate = getDate(i);
      const promise = analytics.retreive(namespace, formatteddate);
      promises.push(promise);
    }
    const fetched = await Promise.all(promises);
    //const data = fetched.sort((a,b) =>{
    //if (parse(a.date, 'yyyy/MM/dd', new Date()) > parse(b.date, 'yyyy/MM/dd', new Date()))
    //   return 1
    //else return 0

    //})
    //return data
  }
}

export const analytics = new Analytics();

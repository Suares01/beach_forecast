interface ITime {
  start: number;
  end: number;
}

export class Time {
  /**
   * @description get next 24 hours in unix timestamp
   * @returns returns the current date and the next 24 hours
   */
  public static getUnixTime(): ITime {
    const now = Math.floor(Date.now() / 1000);
    const nextDay = now + 86400; // 86400 === 24 hours in seconds

    return {
      start: now,
      end: nextDay,
    };
  }
}

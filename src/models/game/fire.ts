export interface Firetarget {
  uid: string,
  name: string,
  fbpic: string,
  planet: {
    cur_planet: string,
    building: {
      lv: number,
      st: number
    }[],
  }
}
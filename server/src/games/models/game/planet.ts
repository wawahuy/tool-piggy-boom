export interface Planet {
  cur_planet: number,
  building: {
      lv: number,
      st: number,
      mi: number
  }[],
  star: number,
  shield: string,
  mini_s: number,
  mini_c: number,
  mini_m: number,
  mini_m_d: number,
  mini_d_s: number
}
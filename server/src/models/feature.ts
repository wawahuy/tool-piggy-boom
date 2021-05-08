export enum EFeature {
  GiftBox1 = 1,
  GiftBox2 = 2,
  HarvestGold = 3,
  SnowBall = 4
}

export enum EFeatureType {
  Toggle = 1,
  Option = 2
}

export enum EFeatureSnowBall {
  Cancel = 1,
  AutoShoot = 2,
  FullShoot = 3
}

export interface OptionItem {
  id: EFeatureSnowBall,
  name: string,
}

export interface FeatureItem {
  id: EFeature,
  name: string,
  type: EFeatureType,
  options?: OptionItem[]
}

export const listFeature: FeatureItem[] = [
  {
    id: EFeature.GiftBox1,
    name: 'Tự xem & nhận quảng cái GiftBox 1',
    type: EFeatureType.Toggle
  },
  {
    id: EFeature.GiftBox2,
    name: 'Tự xem & nhận quảng cái GiftBox 2',
    type: EFeatureType.Toggle
  },
  {
    id: EFeature.HarvestGold,
    name: 'Tự nhận vàng heo đất',
    type: EFeatureType.Toggle
  },
  {
    id: EFeature.SnowBall,
    name: 'Bắn cây thông',
    type: EFeatureType.Option,
    options: [
      {
        id: EFeatureSnowBall.Cancel,
        name: 'Hủy bỏ khi bắn không trúng',
      },
      {
        id: EFeatureSnowBall.AutoShoot,
        name: 'Tự bắn vào quà bất kì',
      },
      {
        id: EFeatureSnowBall.FullShoot,
        name: '1 Hit full cây, nhưng vẫn mất ball tương úng',
      },
    ]
  },
];

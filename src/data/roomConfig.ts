export type RoomType = 'non-attached' | 'attached-2bed' | 'attached-double-single' | '4-bed';

export interface RoomConfig {
  number: number;
  type: RoomType;
  price: number;
  label: string;
  isPermanentlyReserved: boolean;
}

const roomTypeLabels: Record<RoomType, string> = {
  'non-attached': 'Non-Attached',
  'attached-2bed': 'Attached (2 Beds)',
  'attached-double-single': 'Attached (Double + Single)',
  '4-bed': '4-Bed Room',
};

const attached2BedRooms = [7, 14];
const attachedDoubleSingleRooms = [2, 3, 4, 9, 10, 11, 16, 17, 18, 19, 22];
const fourBedRooms = [20];

function getRoomType(num: number): RoomType {
  if (fourBedRooms.includes(num)) return '4-bed';
  if (attachedDoubleSingleRooms.includes(num)) return 'attached-double-single';
  if (attached2BedRooms.includes(num)) return 'attached-2bed';
  return 'non-attached';
}

const prices: Record<RoomType, number> = {
  'non-attached': 600,
  'attached-2bed': 800,
  'attached-double-single': 1000,
  '4-bed': 1500,
};

export const ROOMS: RoomConfig[] = Array.from({ length: 23 }, (_, i) => {
  const num = i + 1;
  const type = getRoomType(num);
  return {
    number: num,
    type,
    price: prices[type],
    label: roomTypeLabels[type],
    isPermanentlyReserved: num === 6,
  };
});

export const getRoom = (num: number) => ROOMS.find(r => r.number === num);
export const getAvailableRooms = () => ROOMS.filter(r => !r.isPermanentlyReserved);

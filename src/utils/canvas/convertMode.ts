export default function convertMode(
  mode: 'Overall' | 'Solo' | 'Doubles' | 'Threes' | 'Fours' | '4v4'
) {
  switch (mode) {
  case 'Overall':
    return 'overAll';
  case 'Solo':
    return 'eight_one';
  case 'Doubles':
    return 'eight_two';
  case 'Threes':
    return 'four_three';
  case 'Fours':
    return 'four_four';
  case '4v4':
    return 'two_four';
  }
}

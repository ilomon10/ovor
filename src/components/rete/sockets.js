import { Socket } from 'rete';

export const NumberSocket = new Socket("Number");
export const DateSocket = new Socket("Date");
export const BooleanSocket = new Socket("Boolean");
export const StringSocket = new Socket("String");
export const UniversalSocket = new Socket('Universal');

UniversalSocket.combineWith(NumberSocket);
UniversalSocket.combineWith(DateSocket);
UniversalSocket.combineWith(BooleanSocket);
UniversalSocket.combineWith(StringSocket);

NumberSocket.combineWith(UniversalSocket);
DateSocket.combineWith(UniversalSocket);
BooleanSocket.combineWith(UniversalSocket);
StringSocket.combineWith(UniversalSocket);
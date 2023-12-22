import { CorpInterface, cdsGroupInterface, corpObject } from "@/types";

export const calculateAttendance = (attendance: Record<string, boolean>): number => {
    const attendedWeeks = Object.values(attendance).filter(
        (value) => value
    ).length;
    return (attendedWeeks / Object.keys(attendance).length) * 100;
};
export const FindCDSPresident = (corps: any): any => {

    if (corps.corps) {
        return corps.corps.find(
            (corpsMember: any) => corpsMember.role === "president"
        );
    } else {
        return corps && corps.find(
            (corpsMember: any) => corpsMember.role === "president"
        );
    }
};

export const searchCorp = (corps: CorpInterface[], searchTerm: string): CorpInterface[] => {
    return corps && corps.filter(
        (corp) =>
            corp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            corp.stateCode.toLowerCase().includes(searchTerm.toLowerCase())
    );
};
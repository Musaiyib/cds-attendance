export const calculateAttendance = (attendance: Record<string, boolean>): number => {
    const attendedWeeks = Object.values(attendance).filter(
        (value) => value
    ).length;
    return (attendedWeeks / Object.keys(attendance).length) * 100;
};
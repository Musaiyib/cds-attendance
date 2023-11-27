// // data.js
// import connectToDB from "./utils";
// import Corp from "./model";

export const fetchCorps = async () => {
    try {
        // await connectToDB();
        // const corps = await Corp.find();
        // return corps;
    } catch (error) {
        console.error("fetchCorps error", error);
        throw new Error("Failed to fetch corps");
    }
};

export const addCorp = async (formData: FormData) => {
    const {
        name,
        stateCode,
        cdsGroup,
        ppa,
        phone,
        state,
        course,
        university,
    } = Object.fromEntries(formData);
    console.log(name,
        stateCode,
        cdsGroup,
        ppa,
        phone,
        state,
        course,
        university,)

    try {
        // connectToDB();

        // const newCorp = await Corp.create({
        //     name,
        //     stateCode,
        //     cdsGroup,
        //     ppa,
        //     phone,
        //     state,
        //     course,
        //     university,
        // });

        // return newCorp; // Returning the created document
    } catch (err) {
        console.log(err);
        throw new Error("Failed to add corp member!");
    }
};

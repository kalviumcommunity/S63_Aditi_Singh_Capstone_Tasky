const getprofile = async(req , res) => {
    try{
        res.status(200).json(req.user)
    } catch(err){
        console.err("Error fetching the profile", err.message);
        res.status(500).json({message:'Server error'});
    }

    module.export = {getprofile};
};
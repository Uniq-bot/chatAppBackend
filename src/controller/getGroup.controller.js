
import { Group } from '../models/group.model.js';

export const getAllGroupsController = async (req, res) => {
    try {
        const groups = await Group.find({})
            .populate('admin', 'name email')
            .populate('members', '_id name email pic')
            .limit(50);
        res.status(200).send({ groups });
    } catch (error) {
        res.status(500).send({ message: "Error in fetching groups", error: error.message });
        console.log(error);
    }
};

export const searchGroupController= async(req, res)=>{

    try {
        const {name}= req.query;
        if(!name){
            return res.status(400).send({message: "Group name is required"});
        }
        const groups= await Group.find({name: {$regex: name, $options: 'i'}});
        res.status(200).send({groups});
        console.log("Group Found", groups)
        
    } catch (error) {
        res.status(500).send({message: "Error in searching group", error: error.message});
        console.log(error)
        
    }

}
//handlers para las routes
import mongoose from 'mongoose'
import PostMessage from '../models/PostMessage.js'

export const getPosts = async (req, res) => {
    try {
        const postMessages = await PostMessage.find()
        res.status(200).json(postMessages)
    } catch (error) {
        res.status(404).json({ message: error.message })
        console.log(error)
    }

}

export const createPost = async (req, res) => {
    const { title, message, selectedFile, creator, tags } = req.body;

    const newPostMessage = new PostMessage({ title, message, selectedFile, creator, tags })

    try {
        await newPostMessage.save();
        console.log("NEW POST MESSAGE")
        res.status(201).json(newPostMessage);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const updatePost = async (req, res) => {
    const { id: _id } = req.params //backend
    const post = req.body //frontend
    const newPost = { ...post, _id }
    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('Invalid id')
    const updatedPost = await PostMessage.findByIdAndUpdate(_id, newPost, { new: true })
    res.json(updatedPost)
}

export const deletePost = async (req, res) => {
    console.log('DELETE |||||||||||||||||||||||||||||||||||||||||||||  POST')
    const { id: _id } = req.params
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        console.log('MONGOOSE ERROR')
        return res.status(404).send('Invalid id')
    }
    try {
        await PostMessage.findByIdAndRemove(_id)
        console.log('DELETE')
    }
    catch (error) {
        console.log('...... No encuentra ID')
        console.log(error)
    }
    res.json({ message: 'Post deleted' })
}

export const likePost = async (req, res) => {
    const { id: _id } = req.params
    if(!req.userId) return res.json({message: 'Unauth'})

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        console.log('MONGOOSE ERROR')
        return res.status(404).send('Invalid id')
    }
    const post = await PostMessage.findById(_id)

    const index = post.likes.findIndex((id)=>{
        id=== String(req.userId) //o sea, ya le dió mg a ese post
    })

    if(index===-1){
        //like the post
        post.likes.push(req.userId)
    }else{
        //unlike the post
        post.likes.filter((id)=> id !== String(req.userId))
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(_id,
        {post}, { new: true })
    res.json(updatedPost)
}
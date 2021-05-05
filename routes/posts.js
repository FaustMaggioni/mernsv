import express from 'express'
import { getPosts, createPost, updatePost, deletePost, likePost } from '../controlers/posts.js'
const router = express.Router();
router.get('/', getPosts)
router.post('/', createPost)
router.patch('/:id', updatePost) //patch es para editar cosas existentes
router.delete('/:id', deletePost)
router.patch('/:id/likePost', likePost)
export default router

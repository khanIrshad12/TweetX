
'use client'

import React, { useEffect, useState } from 'react'
import FeedCard from '../conponents/feedCard'
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from "yup"
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const Feed = () => {

    const [showPopup, setShowPopup] = useState(false);
    const [allPosts, setAllPosts] = useState([])

    const getAllPost = async () => {
        try {
            const res = await axios.get("api/post");
            if (res.status == 200) {
                console.log(res.data);
                setAllPosts(res.data)

            } else {
                console.log("Failed to get the post data", res.data);
            }

        } catch (error) {
            console.log(error);
        }

    }

    const handleSubmit = async (values, { resetForm }) => {
        try {
            const response = await axios.post('/api/post', values);
            if (response.status === 200) {
                resetForm();
                setShowPopup(false);
            }
        } catch (error) {
            console.error('Failed to submit post:', error);
        }
    };

    useEffect(() => {
        getAllPost()
    }, [])

    return (
        <div className='max-w-[620px] mx-auto mt-5 flex flex-col'>
            <div className='my-8'>
                <button className='text-white bg-rose-400 py-2 px-8 rounded-md' onClick={() => setShowPopup(true)}>Write</button>
            </div>

            <AnimatePresence>
                {showPopup && (
                    <motion.div
                        className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className='bg-white p-6 rounded-md shadow-md w-[40%]'
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                        >
                            <Formik
                                initialValues={{ content: '' }}
                                validationSchema={Yup.object({
                                    content: Yup.string()
                                        .min(5, 'Must be at least 5 characters')
                                        .max(50, 'Must be 50 characters or less')
                                        .required('Required'),
                                })}
                                onSubmit={handleSubmit}
                            >
                                {({ isSubmitting }) => (
                                    <Form>
                                        <Field
                                            name='content'
                                            as='textarea'
                                            className='w-full p-2 border rounded resize-none'
                                            placeholder='Write your post...'
                                        />
                                        <ErrorMessage name='content' component='div' className='text-red-500 text-sm' />
                                        <div className='flex justify-end mt-4'>
                                            <button
                                                type='button'
                                                className='text-gray-500 mr-4'
                                                onClick={() => setShowPopup(false)}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type='submit'
                                                className='text-white bg-rose-400 py-2 px-4 rounded-md'
                                                disabled={isSubmitting}
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {allPosts && allPosts.length > 0 ? allPosts?.map((item, id) => (
                <div key={id}>
                    <FeedCard postData={item} />
                </div>
            ))
                : <p className='flex justify-center items-center w-full h-screen text-3xl'>There is no User!!</p>
            }
        </div>
    );
};


export default Feed
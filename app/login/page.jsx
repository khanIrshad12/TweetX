"use client"
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const LoginForm = () => {
    const [showPassword, setShowPassword] = useState(false);

    const router =useRouter()
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const sendLoginData = async (data, resetForm) => {
        console.log(data);
        try {
            const res = await axios.post("/api/login", data);
            if (res.status === 200) {
                toast.success("Login successful!");

                resetForm(); // Reset form fields after successful submission
                router.push("/profile")
            }
        } catch (error) {
            toast.error("Failed to login!");
            console.log(error);
        }
    };

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Email is required'),
            password: Yup.string().required('Password is required'),
        }),
        onSubmit: (values, { resetForm }) => {
            sendLoginData(values, resetForm);
        },
    });

    return (
        <div className='flex justify-between overflow-hidden h-screen'>
            <div className='pl-16 pt-5'>
                <div>
                    <p className='text-rose-500 text-lg'>TweetX</p>
                    <Link href="/">
                        <button className='px-3 text-sm py-1 mt-8 border border-black bg-transparent text-zinc-900 rounded-md'>Create Account</button>
                    </Link>
                </div>
                <form onSubmit={formik.handleSubmit} className='mt-16 flex flex-col gap-5 w-[20rem]'>
                    <h1 className='text-zinc-400 my-8 text-2xl font-semibold'>Login</h1>
                    <input
                        type='text'
                        name='email'
                        className='outline-none p-3 bg-slate-200 rounded-sm w-30'
                        placeholder='Email'
                        {...formik.getFieldProps('email')}
                    />
                    {formik.touched.email && formik.errors.email ? (
                        <div className='text-red-500 text-sm'>{formik.errors.email}</div>
                    ) : null}
                    <div className='relative'>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name='password'
                            className='relative w-full rounded-sm outline-none p-3 bg-slate-200'
                            placeholder='Password'
                            {...formik.getFieldProps('password')}
                        />
                        {formik.touched.password && formik.errors.password ? (
                            <div className='text-red-500 text-sm'>{formik.errors.password}</div>
                        ) : null}
                        <button type='button' className='absolute top-[1.1rem] left-[17.5rem]' onClick={togglePasswordVisibility}>
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    <div className='flex justify-between items-center'>
                        <p>Forget Password?</p>
                        <button type='submit' className='p-2 bg-rose-400 rounded-md text-white'>Login</button>
                    </div>
                </form>
            </div>
            <div className='pt-5 ml-[5rem] relative w-full'>
                <Image src="/images/login-page.png" className='absolute bottom-0 -right-28' width={500} height={800} alt='image' />
            </div>
        </div>
    );
};

export default LoginForm;

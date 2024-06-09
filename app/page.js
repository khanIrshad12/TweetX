'use client'
import { useFormik } from "formik";
import * as Yup from "yup"
import Image from "next/image";
import Link from "next/link";
import axios from "axios"
import { redirect, usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Error from "next/error";

export default function Home() {
    const router = useRouter()

    const sendUserData = async (data, resetForm, setSubmitting) => {
        try {
            const res = await axios.post("api/register", data);
            if (res.status == 201) {
                toast.success("register successfull!!");
                resetForm();
                router.push('/login');
            }
        } catch (error) {
            toast.error(error.response.data.error)
            console.log(error);
            resetForm();

        } finally {
            setSubmitting(false)
        }
    }

    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            username: Yup.string().required('username is required'),
            email: Yup.string().email('Invalid email address').required('Email is required'),
            password: Yup.string().required('Password is required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required('Confirm Password is required'),
        }),
        onSubmit: (values, { resetForm, setSubmitting }) => {
            sendUserData(values, resetForm, setSubmitting)
        },
    });

    return (
        <>

            <div className='flex justify-between overflow-hidden h-screen '>
                <div className='pl-16 pt-5'>
                    <div>
                        <p className='text-rose-500 text-lg'>TweetX</p>
                        <Link href="/login">
                            <button className='px-3 text-sm py-1 mt-8  border border-black bg-transparent text-zinc-900  rounded-md'>Login</button>
                        </Link>
                    </div>
                    <div className='mt-8 flex flex-col gap-5 w-[20rem]'>
                        <h1 className='text-zinc-400 my-8 text-2xl font-semibold'>Create Login</h1>
                        <form onSubmit={formik.handleSubmit} className='flex flex-col gap-5 w-[20rem]'>
                            <input
                                type='text'
                                name='username'
                                className='outline-none p-3 bg-slate-200 rounded-sm w-30'
                                placeholder='Name'
                                {...formik.getFieldProps('username')}
                            />
                            {formik.touched.name && formik.errors.name ? (
                                <div className='text-red-500 text-sm'>{formik.errors.name}</div>
                            ) : null}

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

                            <input
                                type='password'
                                name='password'
                                className='outline-none p-3 bg-slate-200 rounded-sm w-30'
                                placeholder='Password'
                                {...formik.getFieldProps('password')}
                            />
                            {formik.touched.password && formik.errors.password ? (
                                <div className='text-red-500 text-sm'>{formik.errors.password}</div>
                            ) : null}

                            <input
                                type='password'
                                name='confirmPassword'
                                className='outline-none p-3 bg-slate-200 rounded-sm w-30'
                                placeholder='Confirm Password'
                                {...formik.getFieldProps('confirmPassword')}
                            />
                            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                                <div className='text-red-500 text-sm'>{formik.errors.confirmPassword}</div>
                            ) : null}

                            <div className='flex items-center justify-end'>
                                <button type='submit' className='p-2 bg-rose-400 rounded-md text-white'> {formik.isSubmitting ? 'Loading...' : 'SignUp'}</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className='pt-5 ml-[5rem] relative w-full'>
                    <Image src="/images/login-page.png" className='absolute bottom-0 -right-28' width={500} height={800} alt='image' />
                </div>

            </div>
        </>
    );
}

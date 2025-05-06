'use client';

import { useState } from 'react';
import Switch from '@mui/material/Switch';

import { PlusIcon } from "./icons";

import { usePersContext } from "../app/contexts/usePersContext";
import {FileUploader } from "../components/fileUploader";

import useWindowDimensions from "../hooks/useWindowDimensions";

import styles from "../../public/css/subForm.module.css";
import { generateSlug } from "random-word-slugs";

import React from 'react';

export function SubmissionForm({closeOnSubmit} : {closeOnSubmit: () => void}) {

    const {features, stickers} = usePersContext();

    const [status, setStatus] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isPublic, setPublic] = useState<boolean | null>(false);

    // stores a string w metadata and dataUrl of an uploaded images -- submited via hidden field to the form
    const [uploadedImg, setUploadedImg] = useState<any>({
        name: "",
        type: "",
        size: "",
        lastModified: "",
        uploadedAt: "",
        url: ""
    });

    const handleImgUpload = (fileInfo: any) => {
        console.log("File info in submission form!: ", JSON.stringify(fileInfo));
        //TODO: file type verification here!!
        setUploadedImg(fileInfo);
    }

    // for random word replacements
    const nameSlug = generateSlug();
    const deviceSlug = generateSlug();
    console.log("name slug: ", nameSlug);

    // cur window dims to determine if mobile or desktop for a given submission
    const {width, height} = useWindowDimensions();

    // from https://github.com/dmytro-petrenko/sample-dropzone/blob/main/pages/index.js

    const handleSubmit = (e) => {

        setStatus('pending');

        const myForm = e.target;
        const formData = new FormData(myForm);

        // if title or name is blank, randomly select them
        if(formData.get("title") == ""){
            formData.set("title", deviceSlug);
        } 
        if(formData.get("name") == ""){
            formData.set("name", nameSlug);
        } 

        //console.log("file in formData: ", formData.get("dev_img"));

        fetch("/form.html", {
            method: "POST",
            // headers: { "Content-Type": 'multipart/form-data' },
            body: formData //encode(data)
        })
            .then(() => {
                closeOnSubmit();
                setStatus('ok');
            })
            .catch(err => {
                alert("Form Submission Failed!", err);
                setStatus('error');
            });

        e.preventDefault();
    };

    const handleSwitchChange = () => {
        setPublic(!isPublic);
    }

    const [invalidFile, setInvalidFile ] = useState<boolean>(false);
    const validateFile = (e) => {
        console.log("reaching val file again");
        const curFile = e.target.files[0];
        console.log("curFile: ", curFile);
        if (curFile){
            const name = curFile.name;
            if(name.includes(".HEIC") || name.includes(".heic")){
                // alert("Wrong file type!");
                setInvalidFile(true);
                console.log("reaching heic case");
            } else {
                // in case prev file was invalid
                setInvalidFile(false);
            }
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.modelName}>
                    Submit your device
                </div>
                <div className={styles.subtitle}>
                    Your device will be included in a public gallery viewable by others. If you'd like,
                    submit it along with the personalizations you've made to this site -- those who 
                    view your description of the device will have a chance to apply your personalizations to their own 
                    site.
                </div>
            </div>
            <div className={styles.content} >
                {/* file upload box (then passed in as a URL to the form itself) */}
                <div className={styles.formEntry}>
                        <div> Upload an image of your device: </div>
                        <FileUploader onUpload={handleImgUpload} />
                        <div> {uploadedImg.name} </div>
                </div>
                <form
                className="formContainer"
                name="designs"
                method="POST"
                data-netlify="true"
                // encType="multipart-form/data"
                // encType="multipart/form-data"
                onSubmit={handleSubmit} 
                className={styles.formContainer}
                >
                
                    {/* required input to link form to netlify */}
                    <input id='name' type="hidden" name="form-name" value="designs" />

                    {/* hidden inputs */}
                    <input type="hidden" name="features" value={JSON.stringify(features)} />
                    <input type="hidden" name="stickers" value={JSON.stringify(stickers)} />
                    <input type="hidden" name="windowWidth" value={width} />
                    <input type="hidden" name="windowHeight" value={height} />
                    <input type="hidden" name="imageUrl" value={uploadedImg.url} />

                    {/* visual styles inputs */}

                    {/* device name */}
                    <div className={styles.formEntry}>
                        <label htmlFor="title"> Device name </label>
                        <input name="title" type="text" placeholder="Randomly generated if left blank" className={styles.input} />
                    </div>

                    {/* author name */}
                    <div className={styles.formEntry}>
                        <label htmlFor="name"> Your name </label>
                        <input name="name" type="text" placeholder="Randomly generated if left blank" className={styles.input} />
                    </div>

                    {/* image/file upload */}
                    {/* <div className={styles.formEntry} >
                        <label htmlFor="dev_img"> Upload an image of the device </label>
                        <input name="dev_img" id="dev_img" type="file" placeholder="Upload an image" className={styles.fileInput} style={{border: '0', padding: '5px 0px'}} accept="image/*" onChange={(e) => validateFile(e)}/>
                        { invalidFile ? <div className={styles.validation}>
                            Invalid file type - please submit a different image. 
                        </div> : null}
                    </div> */}

                    {/* description */}
                    <div className={styles.formEntry}>
                        <label htmlFor="about"> What about this device is meaningful to you? </label>
                        <input name="about" type="text" placeholder="Optional" className={styles.input} />
                    </div>

                    {/* personalization public toggle */}
                    <div className={styles.formEntry}>
                        {/* <label htmlFor="personalizations"> Make your personalizations to this site public? </label> 
                        <input name="personalizations" type="text" placeholder="Optional" className={styles.input} />*/}
                        <label htmlFor="personalizations" style={{cursor: 'pointer'}} className={styles.switchLabel}>
                            {/* <PlusIcon fill={features.fontColor} size='30px'/>*/}
                            Make your personalizations to this site public?
                            <Switch color='primary' checked={isPublic} onChange={handleSwitchChange}/>
                        </label>
                       {/* <input name="personalizations" id="personalizations" type="checkbox" checked={isPublic} onChange={handleSwitchChange} placeholder="Optional" className={styles.input} style={{display: 'none'}} />*/}
                       <input
                            type="hidden"
                            name="personalizations"
                            value={isPublic ? "true" : "false"}
                            onChange={handleSwitchChange}
                        />
                    </div> 
                   
                    {status === 'error' && <div>{error}</div>}

                    <button type="submit" disabled={status === 'pending' || invalidFile}>
                        Submit
                    </button>

                    {/* <button style={{marginTop: '15px'}} type="submit">Submit</button> */}
                    
                </form>
            </div>
        </div>
    )
}

// ///////////
// function encode(data) {
//     const formData = new FormData();
  
//     for (const key of Object.keys(data)) {
//       formData.append(key, data[key]);
//     }
  
//     return formData;
//   }
//  /////////// 

// // FROM https://opennext.js.org/netlify/forms 
// export function SubmissionForm({closeOnSubmit} : {closeOnSubmit: () => void}) {

    // const {features, stickers} = usePersContext();

    // const [status, setStatus] = useState<string | null>(null);
    // const [error, setError] = useState<string | null>(null);
    // const [isPublic, setPublic] = useState<boolean | null>(false);

    // // cur window dims to determine if mobile or desktop for a given submission
    // const {width, height} = useWindowDimensions();

//     const [contents, setContents] = useState<any>();

    
//       const handleChange = (e) => {
//         setContents({ [e.target.name]: e.target.value });
//       };
    
//       const handleAttachment = (e) => {
//         setContents({ [e.target.name]: e.target.files[0] });
//       };
    
//     //   const handleSubmit = async (e) => {
//     //     // e.preventDefault();
//     //     // const form = e.target;
//     //     // await fetch('/form.html', {
//     //     //   method: "POST",
//     //     //   headers: { 'Content-Type': 'multipart/form-data' },
//     //     // //   body: encode({
//     //     // //     "form-name": form.getAttribute("name"),
//     //     // //     ...contents
//     //     // //   })
//     //     //     body: form,
//     //     // })
//     //     // //   .then(() => navigateTo(form.getAttribute("action")))
//     //     //  .catch(error => alert(error));
//     //     //  setStatus('pending');
//     //     //  setError(null);
//     //     //  const myForm = e.target;
//     //     //  const formData = new FormData(myForm);
//     //     //  const res = await fetch('/form.html', {
//     //     //      method: 'POST',
//     //     //      // headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//     //     //      headers: { 'Content-Type': 'multipart/form-data' },
//     //     //      //body: new URLSearchParams(formData).toString()
//     //     //      body: formData,
//     //     //  });
//     //   };

//     const handleFormSubmit = async (event) => {
//         // event.preventDefault();
//         // try {
//         //     setStatus('pending');
//         //     setError(null);
//         //     const myForm = event.target;
//         //     const formData = new FormData(myForm);
//         //     // const res = await fetch('/form.html', {
//         //     //     method: 'POST',
//         //     //     //headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//         //     //     headers: { 'Content-Type': 'multipart/form-data' },
//         //     //     //body: new URLSearchParams(formData).toString()
//         //     //     body: formData
//         //     // });
//         //     const res = await fetch('/', {
//         //         method: 'POST',
//         //         body: formData
//         //     });
//         //     if (res.status === 200) {
//         //         setStatus('ok');
//         //     } else {
//         //         setStatus('error');
//         //         setError(`${res.status} ${res.statusText}`);
//         //     }
//         // } catch (e) {
//         //     setStatus('error');
//         //     setError(`${e}`);
//         // }
//         event.preventDefault();
//         try {
//             setStatus('pending');
//             setError(null);
//             const myForm = event.target;
//             console.log("myForm, event.target: ", myForm);
//             const formData = new FormData(myForm);
//             console.log("Form data: ", formData.getAll("dev_img"));
//             console.log("Form data but formatted like body: ", new URLSearchParams(formData).toString());
//             /* backup option
//             const res = await fetch('/.netlify/functions/submission-created', {
//                 method: 'POST',
//                 body: formData,
//                 // No headers - let browser set the content type with boundary
//             });
//             */
//             const res = await fetch('/form.html', {
//                 method: 'POST',
//                 //headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//                 //headers: { 'Content-Type': 'multipart/form-data' },
//                 //headers: {'Content-Type': 'image/jpeg'},
//                 //body: new URLSearchParams(formData).toString(),
//                 body: formData,
//             });
//             if (res.status === 200) {
//                 console.log("all good on fetch");
//                 setStatus('ok');
//             } else {
//                 setStatus('error');
//                 setError(`${res.status} ${res.statusText}`);
//             }
//         } catch (e) {
//             setStatus('error');
//             setError(`${e}`);
//         }
//         // finally closing the form window
//         closeOnSubmit();
//     };

    // const handleSwitchChange = () => {
    //     setPublic(!isPublic);
    // }
//     /*
//     things to submit:
//     - features
//     - stickers
//     - maker's name
//     - site name
//     - description
//     */
//     return (
        // <div className={styles.container}>
        //     <div className={styles.header}>
        //         <div className={styles.modelName}>
        //             Submit your device
        //         </div>
        //         <div className={styles.subtitle}>
        //             Your device will be included in a public gallery viewable by others. If you'd like,
        //             submit it along with the personalizations you've made to this site -- those who 
        //             view your description of the device will have a chance to apply your personalizations to their own 
        //             site.
        //         </div>
        //     </div>
        //     <div className={styles.content} >
        //         {/* <form name="designs" method="POST" data-netlify="true" encType="multipart/form-data" onSubmit={handleFormSubmit} className={styles.formContainer} > */}
        //         <form name="designs" method="POST" data-netlify="true" onSubmit={handleFormSubmit} encType="multipart/form-data" className={styles.formContainer} >
        //         {/* <form
        //             name="designs"
        //             method="post"
        //             // action="/thanks/"
        //             data-netlify="true"
        //             data-netlify-honeypot="bot-field"
        //             onSubmit={handleSubmit}
        //             className={styles.formContainer}
        //             > */}
        //             {/* hidden inputs */}
        //             <input type="hidden" name="form-name" value="designs" />

                    // <input type="hidden" name="features" value={JSON.stringify(features)} />
                    // <input type="hidden" name="stickers" value={JSON.stringify(stickers)} />
                    // <input type="hidden" name="windowWidth" value={width} />
                    // <input type="hidden" name="windowHeight" value={height} />

                    // {/* anti bot stuff */}
                    // <p hidden>
                    //     <label>
                    //     Don’t fill this out:{" "}
                    //     <input name="bot-field" onChange={handleChange} />
                    //     </label>
                    // </p>

                    // {/* visual styles inputs */}

                    // <div className={styles.formEntry}>
                    //     <label htmlFor="title"> Device Name </label>
                    //     <input name="title" type="text" placeholder="Randomly generated if left blank" required className={styles.input} onChange={handleChange}/>
                    // </div>

                    // <div className={styles.formEntry}>
                    //     <label htmlFor="name"> Your Name </label>
                    //     <input name="name" type="text" placeholder="Randomly generated if left blank" className={styles.input} onChange={handleChange} />
                    // </div>

                    // <div className={styles.formEntry}>
                    //     <label htmlFor="dev_img"> Upload an image </label>
                    //     {/* <label htmlFor="dev_img" style={{cursor: 'pointer'}} className={styles.switchLabel}>
                    //         Upload an image
                    //         <PlusIcon fill={features.fontColor} size='30px'/>
                    //     </label> */}
                    //     <input name="dev_img" id="dev_img" type="file" placeholder="Upload an image" className={styles.input} onChange={handleAttachment}/>
                    // </div>

                    // <div className={styles.formEntry}>
                    //     <label htmlFor="about"> What about this device is meaningful to you? </label>
                    //     <input name="about" type="text" placeholder="Optional" className={styles.input} onChange={handleChange} />
                    // </div>

                    // <div className={styles.formEntry}>
                    //     {/* <label htmlFor="personalizations"> Make your personalizations to this site public? </label> 
                    //     <input name="personalizations" type="text" placeholder="Optional" className={styles.input} />*/}
                    //     <label htmlFor="personalizations" style={{cursor: 'pointer'}} className={styles.switchLabel}>
                    //         {/* <PlusIcon fill={features.fontColor} size='30px'/>*/}
                    //         Make your personalizations to this site public?
                    //         <Switch color='primary' checked={isPublic} onChange={handleSwitchChange}/>
                    //     </label>
                    //    {/* <input name="personalizations" id="personalizations" type="checkbox" checked={isPublic} onChange={handleSwitchChange} placeholder="Optional" className={styles.input} style={{display: 'none'}} />*/}
                    //    <input
                    //         type="hidden"
                    //         name="personalizations"
                    //         value={isPublic ? "true" : "false"}
                    //         onChange={handleChange}
                    //     />
                    // </div> 
                   
                    // {status === 'error' && <div>{error}</div>}

                    // <button type="submit" disabled={status === 'pending'} style={{cursor: 'pointer'}}>
                    //     Submit
                    // </button>

//                     {/* {status === 'ok' && <div> Submitted!</div>} */}
//                 </form>
//             </div>
//         </div>
//     );
// }

// 'use client';

// import { useState } from 'react';
// import { usePersContext } from "../app/contexts/usePersContext";
// import useWindowDimensions from "../hooks/useWindowDimensions";
// import styles from "../../public/css/subForm.module.css";

// export function SubmissionForm({ closeOnSubmit }: { closeOnSubmit: () => void }) {
//   const { features, stickers } = usePersContext();
//   const { width, height } = useWindowDimensions();

//   const [name, setName] = useState('');
//   const [devImg, setDevImg] = useState<File | null>(null);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] || null;
//     setDevImg(file);
//   };

//   return (
//     <div>
//       <form
//         className="formContainer"
//         name="designs"
//         method="POST"
//         data-netlify="true"
//         encType="multipart/form-data"
//         onSubmit={() => {
//           alert('Submitting form...');
//           closeOnSubmit(); 
//         }}
//       >
//         <input type="hidden" name="form-name" value="designs" />

//         <label htmlFor="name">Name: </label>
//         <input
//           type="text"
//           name="name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//         />

//         <div className={styles.formEntry}>
//           <label htmlFor="dev_img">Upload an image</label>
//           <input
//             name="dev_img"
//             id="dev_img"
//             type="file"
//             className={styles.input}
//             onChange={handleFileChange}
//           />
//         </div>

//         <input type="hidden" name="features" value={JSON.stringify(features)} />
//         <input type="hidden" name="stickers" value={JSON.stringify(stickers)} />
//         <input type="hidden" name="windowWidth" value={width} />
//         <input type="hidden" name="windowHeight" value={height} />

//         <div className={styles.formEntry}>
//           <label htmlFor="title">Device Name</label>
//           <input
//             name="title"
//             type="text"
//             placeholder="Randomly generated if left blank"
//             className={styles.input}
//           />
//         </div>

//         <div className={styles.formEntry}>
//           <label htmlFor="your_name">Your Name</label>
//           <input
//             name="your_name"
//             type="text"
//             placeholder="Randomly generated if left blank"
//             className={styles.input}
//           />
//         </div>

//         <button style={{ marginTop: '15px' }} type="submit">Submit</button>
//       </form>
//     </div>
//   );
// }
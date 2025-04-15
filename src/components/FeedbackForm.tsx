'use client';

import { useState } from 'react';
// import { Alert } from './alert';
// import { Card } from './card';

export function FeedbackForm() {
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            setStatus('pending');
            setError(null);
            const myForm = event.target;
            const formData = new FormData(myForm);
            const res = await fetch('/form.html', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            });
            if (res.status === 200) {
                setStatus('ok');
            } else {
                setStatus('error');
                setError(`${res.status} ${res.statusText}`);
            }
        } catch (e) {
            setStatus('error');
            setError(`${e}`);
        }
    };

    return (
        <div className="w-full md:max-w-md">
                <form name="feedback" onSubmit={handleFormSubmit} className="flex flex-col gap-3 align-center">
                    <input type="hidden" name="form-name" value="feedback" />
                    <input name="name" type="text" placeholder="Name" required className="input" />
                    <input name="email" type="email" placeholder="Email (optional)" className="input" />
                    <input name="message" type="text" placeholder="Message" required className="input" />
                    <button className="btn" type="submit" disabled={status === 'pending'}>
                        Submit
                    </button>
                    {status === 'ok' && <div> Submitted!</div>}
                    {status === 'error' && <div>{error}</div>}
                </form>
        </div>
    );
}

// "use client";
 
// export function FeedbackForm() {
//   const handleFormSubmit = async (event) => {
//     event.preventDefault();
//     const formData = new FormData(event.target);
//     await fetch("../../form.html", {
//       method: "POST",
//         headers: { "Content-Type": "application/x-www-form-urlencoded" },
//         body: new URLSearchParams(formData).toString(),
//     });
//     // Success and error handling ...
//     // console.log("result: ", result);
//   };

  
 
//   return (
//     <form name="feedback" onSubmit={handleFormSubmit}>
//       <input type="hidden" name="form-name" value="feedback" />
//       <input name="name" type="text" placeholder="Name" required />
//       <input name="email" type="text" placeholder="Email (optional)" />
//       <button type="submit">Submit</button>
//     </form>
//   );
// }
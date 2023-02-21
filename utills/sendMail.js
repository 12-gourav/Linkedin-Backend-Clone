import { createTransport } from "nodemailer";

export const sendMails = async (email,subject,text) =>{
    console.log(email);
const transport = createTransport({
    service: "gmail",
    auth:{
        user:"amazonego23@gmail.com",
        pass:"atrsrivjusmxpbhs"
    },
    port:465,
    host:"smtp.gmail.com",
    tls: {rejectUnauthorized: false},
   
   
});

await transport.sendMail({
    from:"amazonego23@gmail.com",
    to:email,
    subject,
    text

});

console.log(transport);


}
import nodemailer from 'nodemailer';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  
  // Nodemailer transport setup
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: process.env.CONTACT_EMAIL || 'test@example.com', // 선교사님 이메일 (임시)
    subject: `[VTB 홈페이지 문의] ${body.type === 'materials' ? '자료 요청' : body.type === 'prayer' ? '기도 동역' : '일반 문의'} - ${body.name}`,
    text: `
      이름: ${body.name}
      이메일: ${body.email}
      문의 유형: ${body.type}
      
      메시지:
      ${body.message}
    `,
  };

  try {
    // 실제 운영 환경에서는 아래 메일 전송 로직의 주석을 해제합니다.
    // await transporter.sendMail(mailOptions);
    
    // 테스트용 콘솔 출력
    console.log('메일 전송 시뮬레이션:', mailOptions);

    return { success: true, message: 'Message sent successfully.' };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: 'Failed to send message.' };
  }
});

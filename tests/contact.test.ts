import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CONTACT_RECIPIENT,
  createContactMail,
  parseContactInput,
} from '../server/lib/contact-email.ts';

test('contact mail is validated and always addressed to the requested mailbox', () => {
  const input = parseContactInput({
    name: '홍길동',
    email: 'sender@example.com',
    type: 'prayer',
    message: '기도 제목을 전달합니다.',
    website: '',
  });
  const mail = createContactMail(input, 'mailer@gmail.com');
  assert.equal(CONTACT_RECIPIENT, 'visionthruthebible@gmail.com');
  assert.equal(mail.to, CONTACT_RECIPIENT);
  assert.deepEqual(mail.replyTo, {
    name: '홍길동',
    address: 'sender@example.com',
  });
  assert.match(mail.subject, /기도 동역/);
  assert.match(mail.text, /기도 제목을 전달합니다/);
});

test('contact input rejects invalid fields, bot traps and header injection', () => {
  const valid = {
    name: 'Sender',
    email: 'sender@example.com',
    type: 'general',
    message: 'A valid message',
    website: '',
  };
  assert.throws(() => parseContactInput({ ...valid, email: 'invalid' }));
  assert.throws(() => parseContactInput({ ...valid, type: 'other' }));
  assert.throws(() => parseContactInput({ ...valid, website: 'spam.example' }));
  assert.throws(() => parseContactInput({ ...valid, name: 'Sender\r\nBcc: x@example.com' }));
  assert.throws(() => parseContactInput({ ...valid, message: 'x'.repeat(5001) }));
});

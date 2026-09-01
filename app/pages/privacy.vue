<template>
  <section class="px-6 pb-24 pt-32 md:pb-32 md:pt-40">
    <article
      class="mx-auto rounded-3xl border border-[#E8E3DD] bg-white px-6 py-10 shadow-[0_18px_60px_rgba(45,42,38,0.06)] md:px-12 md:py-14"
      style="max-width: 920px;"
    >
      <header class="mb-12 border-b border-[#E8E3DD] pb-10">
        <p class="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#E87A5D]">Privacy Policy</p>
        <h1 class="mb-5 text-3xl font-semibold tracking-tight text-[#171717] md:text-5xl">{{ content.title }}</h1>
        <p class="max-w-3xl text-base leading-7 text-[#625D58] md:text-lg">{{ content.intro }}</p>
        <p class="mt-5 text-sm font-medium text-[#7A7571]">{{ content.effectiveDate }}</p>
      </header>

      <div class="space-y-10">
        <section v-for="section in content.sections" :key="section.title">
          <h2 class="mb-4 text-xl font-semibold text-[#171717] md:text-2xl">{{ section.title }}</h2>
          <p
            v-for="paragraph in section.paragraphs"
            :key="paragraph"
            class="mb-3 text-[15px] leading-7 text-[#625D58] last:mb-0 md:text-base"
          >
            {{ paragraph }}
          </p>
          <ul v-if="section.items?.length" class="mt-4 list-disc space-y-3 pl-6 text-[15px] leading-7 text-[#625D58] md:text-base">
            <li v-for="item in section.items" :key="item">{{ item }}</li>
          </ul>
          <div v-if="section.links?.length" class="mt-5 flex flex-col items-start gap-2">
            <a
              v-for="link in section.links"
              :key="link.href"
              :href="link.href"
              target="_blank"
              rel="noopener noreferrer"
              class="font-medium text-[#C85F44] underline decoration-[#E8B7A8] underline-offset-4 transition-colors hover:text-[#9F452F]"
            >
              {{ link.label }}
            </a>
          </div>
        </section>
      </div>

      <div class="mt-12 rounded-2xl bg-[#F8F3EC] p-6 md:p-8">
        <h2 class="mb-3 text-lg font-semibold text-[#171717]">{{ content.contactTitle }}</h2>
        <p class="text-[15px] leading-7 text-[#625D58] md:text-base">{{ content.contactText }}</p>
        <a
          href="mailto:contact@visionthruthebible.org"
          class="mt-3 inline-block font-medium text-[#C85F44] underline decoration-[#E8B7A8] underline-offset-4"
        >
          contact@visionthruthebible.org
        </a>
      </div>
    </article>
  </section>
</template>

<script setup lang="ts">
type PolicySection = {
  title: string;
  paragraphs: string[];
  items?: string[];
  links?: Array<{ label: string; href: string }>;
};

type PolicyCopy = {
  title: string;
  intro: string;
  effectiveDate: string;
  sections: PolicySection[];
  contactTitle: string;
  contactText: string;
};

const googlePolicyUrl = 'https://developers.google.com/terms/api-services-user-data-policy';
const googleConnectionsUrl = 'https://myaccount.google.com/connections';

const policies: Record<'ko' | 'en' | 'es' | 'pt', PolicyCopy> = {
  ko: {
    title: '개인정보처리방침',
    intro: 'Vision Thru the Bible Ministries는 이용자의 개인정보를 소중히 여기며, 홈페이지와 소식지 운영에 필요한 범위에서만 정보를 처리합니다.',
    effectiveDate: '시행일: 2026년 9월 1일',
    sections: [
      {
        title: '1. 처리하는 정보',
        paragraphs: [],
        items: [
          '문의 양식을 이용할 때 이름, 이메일 주소, 문의 유형 및 문의 내용을 처리합니다.',
          '관리자가 Google Drive를 연결할 때 OAuth 인증 토큰과 앱이 Google Drive에 생성하거나 선택한 파일의 ID, 이름, 형식 및 크기 정보를 처리합니다. Google 계정 비밀번호는 수집하지 않습니다.',
          '서비스 운영 과정에서 접속 기록, IP 주소, 브라우저 정보 및 오류 기록이 호스팅 서비스에 의해 자동으로 처리될 수 있습니다.',
        ],
      },
      {
        title: '2. 이용 목적',
        paragraphs: [],
        items: [
          '문의 접수와 답변, 선교 자료 요청 및 동역 문의 처리',
          '소식지 작성, 게시, 이미지와 PDF 첨부파일의 저장 및 제공',
          '관리자 인증, 보안 유지, 오류 확인 및 서비스 개선',
        ],
      },
      {
        title: '3. Google Drive 데이터 사용',
        paragraphs: [
          '이 서비스는 Google Drive의 drive.file 권한만 사용합니다. 이 권한은 소식지 PDF를 업로드·연결·다운로드·삭제하기 위해 앱이 직접 생성하거나 사용자가 앱에서 선택한 파일에만 접근합니다. 앱과 관계없는 다른 Google Drive 파일을 탐색하거나 변경하지 않습니다.',
          'Google API에서 받은 정보의 사용 및 다른 앱으로의 전송은 제한적 사용 요건을 포함한 Google API 서비스 사용자 데이터 정책을 준수합니다.',
        ],
        links: [{ label: 'Google API 서비스 사용자 데이터 정책', href: googlePolicyUrl }],
      },
      {
        title: '4. 보관 및 삭제',
        paragraphs: ['문의 정보는 답변과 후속 연락에 필요한 기간 동안 보관한 뒤 삭제합니다. 소식지와 첨부파일은 관리자가 삭제하거나 운영 목적이 종료될 때까지 보관됩니다. Google OAuth 인증 정보는 Drive 연결을 해제하거나 권한을 철회할 때까지 보관하며, 더 이상 필요하지 않으면 안전하게 삭제합니다.'],
      },
      {
        title: '5. 외부 서비스와 정보 제공',
        paragraphs: ['서비스 운영을 위해 Vercel, Google Firebase, Google Drive 및 이메일 전송 서비스가 필요한 정보를 처리할 수 있습니다. 개인정보를 판매하거나 맞춤형 광고에 사용하지 않으며, 법령상 의무가 있는 경우를 제외하고 운영 목적과 무관한 제3자에게 제공하지 않습니다.'],
      },
      {
        title: '6. 이용자의 선택과 권리',
        paragraphs: ['이용자는 자신의 정보에 대한 열람, 정정 또는 삭제를 요청할 수 있습니다. Google 계정의 연결 관리 화면에서 언제든지 이 앱의 Drive 접근 권한을 철회할 수 있습니다.'],
        links: [{ label: 'Google 계정 연결 관리', href: googleConnectionsUrl }],
      },
      {
        title: '7. 보안 및 방침 변경',
        paragraphs: ['접근 통제와 암호화 등 합리적인 보호 조치를 적용합니다. 본 방침이 변경되면 이 페이지에 시행일과 함께 게시합니다.'],
      },
    ],
    contactTitle: '개인정보 문의',
    contactText: '본 방침 또는 개인정보 처리에 관한 문의와 요청은 아래 이메일로 보내주세요.',
  },
  en: {
    title: 'Privacy Policy',
    intro: 'Vision Thru the Bible Ministries respects your privacy and processes information only as needed to operate this website and its newsletter service.',
    effectiveDate: 'Effective: September 1, 2026',
    sections: [
      {
        title: '1. Information we process',
        paragraphs: [],
        items: [
          'When you use the contact form, we process your name, email address, inquiry type, and message.',
          'When an administrator connects Google Drive, we process OAuth credentials and the ID, name, type, and size of files created or selected through this app. We do not collect Google account passwords.',
          'Hosting providers may automatically process access logs, IP addresses, browser information, and error logs when the service is used.',
        ],
      },
      {
        title: '2. How we use information',
        paragraphs: [],
        items: [
          'To receive and respond to inquiries, requests for ministry materials, and partnership questions',
          'To create and publish newsletters and store and deliver image and PDF attachments',
          'To authenticate administrators, maintain security, diagnose errors, and improve the service',
        ],
      },
      {
        title: '3. Use of Google Drive data',
        paragraphs: [
          'This service uses only the Google Drive drive.file permission. It accesses only files created by this app or selected through the app in order to upload, attach, download, or delete newsletter PDFs. It does not browse or modify unrelated files in your Google Drive.',
          'The use and transfer of information received from Google APIs complies with the Google API Services User Data Policy, including its Limited Use requirements.',
        ],
        links: [{ label: 'Google API Services User Data Policy', href: googlePolicyUrl }],
      },
      {
        title: '4. Retention and deletion',
        paragraphs: ['Inquiry information is kept only as long as needed to respond and follow up, then deleted. Newsletters and attachments are retained until an administrator deletes them or they are no longer needed. Google OAuth credentials are retained until Drive is disconnected or access is revoked and are securely deleted when no longer needed.'],
      },
      {
        title: '5. Service providers and sharing',
        paragraphs: ['Vercel, Google Firebase, Google Drive, and an email delivery provider may process information as needed to operate the service. We do not sell personal information or use it for personalized advertising, and we do not disclose it for unrelated purposes unless required by law.'],
      },
      {
        title: '6. Your choices and rights',
        paragraphs: ['You may request access to, correction of, or deletion of your information. You can revoke this app’s Google Drive access at any time from your Google Account connections page.'],
        links: [{ label: 'Manage Google Account connections', href: googleConnectionsUrl }],
      },
      {
        title: '7. Security and policy updates',
        paragraphs: ['We use reasonable safeguards, including access controls and encryption. If this policy changes, we will post the updated version and effective date on this page.'],
      },
    ],
    contactTitle: 'Privacy inquiries',
    contactText: 'For questions or requests concerning this policy or your information, contact us at:',
  },
  es: {
    title: 'Política de Privacidad',
    intro: 'Vision Thru the Bible Ministries respeta su privacidad y trata información únicamente cuando es necesario para operar este sitio web y su servicio de boletines.',
    effectiveDate: 'Vigente desde: 1 de septiembre de 2026',
    sections: [
      {
        title: '1. Información que tratamos',
        paragraphs: [],
        items: [
          'Al utilizar el formulario de contacto, tratamos su nombre, correo electrónico, tipo de consulta y mensaje.',
          'Cuando un administrador conecta Google Drive, tratamos las credenciales OAuth y el identificador, nombre, tipo y tamaño de los archivos creados o seleccionados mediante esta aplicación. No recopilamos contraseñas de cuentas de Google.',
          'Los proveedores de alojamiento pueden tratar automáticamente registros de acceso, direcciones IP, información del navegador y registros de errores.',
        ],
      },
      {
        title: '2. Cómo usamos la información',
        paragraphs: [],
        items: [
          'Para recibir y responder consultas, solicitudes de materiales ministeriales y preguntas de colaboración',
          'Para crear y publicar boletines, y almacenar y entregar archivos adjuntos de imagen y PDF',
          'Para autenticar administradores, mantener la seguridad, diagnosticar errores y mejorar el servicio',
        ],
      },
      {
        title: '3. Uso de datos de Google Drive',
        paragraphs: [
          'Este servicio utiliza únicamente el permiso drive.file de Google Drive. Accede solo a archivos creados por esta aplicación o seleccionados mediante ella para subir, adjuntar, descargar o eliminar PDF de boletines. No explora ni modifica otros archivos de Google Drive.',
          'El uso y la transferencia de información recibida de las API de Google cumplen la Política de Datos de Usuario de los Servicios de API de Google, incluidos sus requisitos de Uso Limitado.',
        ],
        links: [{ label: 'Política de Datos de Usuario de los Servicios de API de Google', href: googlePolicyUrl }],
      },
      {
        title: '4. Conservación y eliminación',
        paragraphs: ['La información de consultas se conserva solo durante el tiempo necesario para responder y realizar el seguimiento. Los boletines y adjuntos se conservan hasta que un administrador los elimine o dejen de ser necesarios. Las credenciales OAuth se conservan hasta que se desconecta Drive o se revoca el acceso, y se eliminan de forma segura cuando dejan de ser necesarias.'],
      },
      {
        title: '5. Proveedores y divulgación',
        paragraphs: ['Vercel, Google Firebase, Google Drive y un proveedor de correo electrónico pueden tratar información cuando sea necesario para operar el servicio. No vendemos información personal ni la usamos para publicidad personalizada, y no la divulgamos para fines ajenos salvo obligación legal.'],
      },
      {
        title: '6. Sus opciones y derechos',
        paragraphs: ['Puede solicitar acceso, corrección o eliminación de su información. Puede revocar el acceso de esta aplicación a Google Drive en cualquier momento desde la página de conexiones de su Cuenta de Google.'],
        links: [{ label: 'Administrar conexiones de la Cuenta de Google', href: googleConnectionsUrl }],
      },
      {
        title: '7. Seguridad y cambios',
        paragraphs: ['Aplicamos medidas razonables de protección, incluidos controles de acceso y cifrado. Si esta política cambia, publicaremos en esta página la versión actualizada y su fecha de vigencia.'],
      },
    ],
    contactTitle: 'Consultas sobre privacidad',
    contactText: 'Para preguntas o solicitudes relacionadas con esta política o sus datos, contáctenos en:',
  },
  pt: {
    title: 'Política de Privacidade',
    intro: 'A Vision Thru the Bible Ministries respeita sua privacidade e trata informações somente quando necessário para operar este site e seu serviço de boletins.',
    effectiveDate: 'Vigente a partir de: 1 de setembro de 2026',
    sections: [
      {
        title: '1. Informações que tratamos',
        paragraphs: [],
        items: [
          'Ao usar o formulário de contato, tratamos seu nome, endereço de e-mail, tipo de solicitação e mensagem.',
          'Quando um administrador conecta o Google Drive, tratamos credenciais OAuth e o ID, nome, tipo e tamanho dos arquivos criados ou selecionados por este aplicativo. Não coletamos senhas de contas Google.',
          'Os provedores de hospedagem podem tratar automaticamente registros de acesso, endereços IP, informações do navegador e registros de erros.',
        ],
      },
      {
        title: '2. Como usamos as informações',
        paragraphs: [],
        items: [
          'Para receber e responder dúvidas, pedidos de materiais ministeriais e perguntas sobre parceria',
          'Para criar e publicar boletins e armazenar e fornecer anexos de imagem e PDF',
          'Para autenticar administradores, manter a segurança, diagnosticar erros e melhorar o serviço',
        ],
      },
      {
        title: '3. Uso de dados do Google Drive',
        paragraphs: [
          'Este serviço usa somente a permissão drive.file do Google Drive. Ele acessa apenas arquivos criados por este aplicativo ou selecionados por meio dele para enviar, anexar, baixar ou excluir PDFs de boletins. Ele não pesquisa nem modifica outros arquivos do Google Drive.',
          'O uso e a transferência de informações recebidas das APIs do Google obedecem à Política de Dados do Usuário dos Serviços de API do Google, incluindo os requisitos de Uso Limitado.',
        ],
        links: [{ label: 'Política de Dados do Usuário dos Serviços de API do Google', href: googlePolicyUrl }],
      },
      {
        title: '4. Retenção e exclusão',
        paragraphs: ['As informações de contato são mantidas apenas pelo tempo necessário para responder e acompanhar a solicitação. Boletins e anexos são mantidos até que um administrador os exclua ou deixem de ser necessários. As credenciais OAuth são mantidas até que o Drive seja desconectado ou o acesso revogado e são excluídas com segurança quando não forem mais necessárias.'],
      },
      {
        title: '5. Provedores e compartilhamento',
        paragraphs: ['Vercel, Google Firebase, Google Drive e um provedor de envio de e-mail podem tratar informações conforme necessário para operar o serviço. Não vendemos informações pessoais nem as usamos para publicidade personalizada e não as divulgamos para finalidades não relacionadas, salvo exigência legal.'],
      },
      {
        title: '6. Suas escolhas e direitos',
        paragraphs: ['Você pode solicitar acesso, correção ou exclusão das suas informações. É possível revogar o acesso deste aplicativo ao Google Drive a qualquer momento na página de conexões da Conta Google.'],
        links: [{ label: 'Gerenciar conexões da Conta Google', href: googleConnectionsUrl }],
      },
      {
        title: '7. Segurança e alterações',
        paragraphs: ['Adotamos medidas de proteção razoáveis, incluindo controles de acesso e criptografia. Se esta política mudar, publicaremos nesta página a versão atualizada e sua data de vigência.'],
      },
    ],
    contactTitle: 'Dúvidas sobre privacidade',
    contactText: 'Para dúvidas ou solicitações relacionadas a esta política ou às suas informações, entre em contato:',
  },
};

const { locale } = useI18n();
const policyLocale = computed(() => (['ko', 'en', 'es', 'pt'].includes(locale.value) ? locale.value : 'ko') as keyof typeof policies);
const content = computed(() => policies[policyLocale.value]);

useHead(() => ({
  title: `${content.value.title} | Vision Thru the Bible Ministries`,
  meta: [{ name: 'description', content: content.value.intro }],
}));
</script>

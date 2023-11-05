const emailContentProvider = ({ title, children }: { title: string; children: string }) => {
  return `
        <div style="border: 1px solid lightgray; padding: 1rem; border-radius: 4px">
            <h1>${title}</h1>
            ${children}
            <p>Trân trọng,</p>
            <p>${process.env.APP_NAME}</p>
        </div>
    `
}

export default emailContentProvider

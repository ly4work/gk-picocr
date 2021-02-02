export default function({ file }) {
  return new Promise((resolve, reject) => {
    console.log(`【File Start】=> FileBlob To Base64`)
    const reader = new FileReader();
    //  转base64
    reader.onload = function(e) {
      resolve(e.target.result);
    };
    reader.onerror = function(error) {
      reject(error);
    };
    reader.readAsDataURL(file.raw);
  });
}

import React, { useRef } from "react";

const UploadFotos = ({ fotos, setFotos }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (fotos.length + files.length > 3) {
      alert("Máximo de 3 fotos!");
      return;
    }
    const novasFotos = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setFotos([...fotos, ...novasFotos]);
    e.target.value = "";
  };

  const removerFoto = (index, e) => {
    e.stopPropagation();
    setFotos(fotos.filter((_, i) => i !== index));
  };

  return (
    <section className="coleta-card upload-card-grande">
      <div className="upload-content">
        <div className="upload-text-center">
          <i className="fas fa-camera" style={{ fontSize: "35px", color: "#4b5563" }}></i>
          <h3 style={{ fontSize: "18px", margin: "10px 0" }}>Anexar Fotos</h3>
          <p style={{ fontSize: "14px", color: "#666", margin: "10px 0" }}>
            Anexe até 3 fotos do lixo eletrônico para ajudar na triagem
          </p>
          <input
            type="file"
            multiple
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>

        <div className="upload-right-side">
          <div className="photo-placeholders">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="box-upload"
                onClick={() => fileInputRef.current.click()}
                style={{ cursor: "pointer", overflow: "hidden", width: "100px" }}
              >
                {fotos[i] ? (
                  <div style={{ position: "relative", width: "100%", height: "100%" }}>
                    <img
                      src={fotos[i].url}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      alt="Preview"
                    />
                    <button
                      className="remover-foto"
                      onClick={(e) => removerFoto(i, e)}
                      style={{ position: "absolute", top: "4px", right: "4px" }}
                    >✕</button>
                  </div>
                ) : (
                  <i className="far fa-image" style={{ fontSize: "24px", color: "#ccc" }}></i>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UploadFotos;
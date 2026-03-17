import { ChangeEvent } from "react";
import Image from "next/image";

type UploadPanelProps = {
  previewImage: string;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export function UploadPanel({ previewImage, onFileChange }: UploadPanelProps) {
  return (
    <section className="surface-card">
      <div className="section-heading">
        <h2>现场墙面照片</h2>
        <p>支持上传现场照片，先以本地预览形式参与 mock 生成流程。</p>
      </div>
      <label className="upload-dropzone">
        <input type="file" accept="image/*" onChange={onFileChange} />
        <span>点击上传或替换现场照片</span>
      </label>
      <div className="upload-preview">
        <Image src={previewImage} alt="现场墙面预览" fill unoptimized sizes="(max-width: 1080px) 100vw, 48vw" />
        <div className="upload-preview__overlay">
          <span>现场图预览</span>
          <strong>用于生成前参考</strong>
        </div>
      </div>
    </section>
  );
}

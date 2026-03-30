import styles from "./MdxSlides.module.css";

interface SpeakerLink {
  label: string;
  url: string;
}

interface SpeakerCardProps {
  name: string;
  photo: string;
  role: string;
  org: string;
  links?: SpeakerLink[];
  qrUrl?: string;
}

export function SpeakerCard({
  name,
  photo,
  role,
  org,
  links = [],
  qrUrl,
}: SpeakerCardProps) {
  return (
    <div className={styles.speakerLayout}>
      <div className={styles.speakerMain}>
        <h1 className={styles.speakerName}>{name}</h1>
        <div className={styles.speakerBody}>
          <div className={styles.speakerPhotoWrap}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo}
              alt={name}
              className={styles.speakerPhoto}
            />
          </div>
          <div className={styles.speakerInfo}>
            <div className={styles.speakerRole}>{role}</div>
            <div className={styles.speakerOrg}>{org}</div>
            <div className={styles.speakerLinks}>
              {links.map((link) => (
                <div key={link.label} className={styles.speakerLink}>
                  {link.url}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {qrUrl && (
        <div className={styles.speakerQr}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrUrl)}&bgcolor=1A1A1A&color=E0E0E0&format=svg`}
            alt="QR Code"
            className={styles.speakerQrImg}
          />
        </div>
      )}
    </div>
  );
}

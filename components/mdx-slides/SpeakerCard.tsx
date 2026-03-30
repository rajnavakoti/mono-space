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
  interests?: string[];
  links?: SpeakerLink[];
  qrUrl?: string;
}

export function SpeakerCard({
  name,
  photo,
  role,
  org,
  interests = [],
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
            {interests.length > 0 && (
              <div className={styles.speakerInterests}>
                {interests.map((item, i) => (
                  <span key={item}>
                    {i > 0 && <span className={styles.speakerInterestSep}> · </span>}
                    {item}
                  </span>
                ))}
              </div>
            )}
            {links.length > 0 && (
              <div className={styles.speakerLinks}>
                {links.map((link) => (
                  <div key={link.label} className={styles.speakerLink}>
                    <span className={styles.speakerLinkLabel}>{link.label}</span>
                    {link.url}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {qrUrl && (
        <div className={styles.speakerQr}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrUrl)}&bgcolor=FFFFFF&color=000000&format=svg`}
            alt="QR Code"
            className={styles.speakerQrImg}
          />
        </div>
      )}
    </div>
  );
}

import * as React from "react";
import Svg, {Path} from "react-native-svg";

export default function Settings(props) {
  return (
    <Svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M14.0226 28C13.2561 28 12.4896 28 11.7231 28C10.4606 27.9781 9.60392 27.2568 9.37848 26.0546C9.31084 25.5956 9.24321 25.1585 9.15303 24.6994C8.95014 23.6503 7.95819 23.082 6.92115 23.4098C6.42518 23.5628 5.9292 23.7814 5.43323 23.9344C4.3511 24.2841 3.29152 23.9344 2.70537 22.9945C1.87123 21.6612 1.08218 20.3279 0.315675 18.9727C-0.225388 18.0109 -0.0224893 16.9836 0.811649 16.2404C1.17236 15.9344 1.53307 15.6721 1.89377 15.3661C2.90827 14.5355 2.90827 13.4426 1.91632 12.612C1.55561 12.3279 1.17236 12.0437 0.834194 11.7377C-0.0224892 10.9945 -0.225388 9.94535 0.338219 8.96174C1.08218 7.67212 1.87123 6.33879 2.68282 5.02732C3.29152 4.04371 4.32856 3.69398 5.45577 4.06557C5.9292 4.21857 6.40263 4.43715 6.87606 4.59016C7.95819 4.93988 8.92759 4.37158 9.15303 3.27868C9.24321 2.84152 9.31084 2.38251 9.37848 1.92349C9.58138 0.76502 10.4606 0.0218506 11.678 0.0218506C13.211 0.0218506 14.7666 0.0218506 16.2996 0.0218506C17.517 0.0218506 18.3962 0.76502 18.5991 1.94535C18.6893 2.40436 18.7569 2.84152 18.8245 3.30054C19.0274 4.39344 20.0194 4.96174 21.1015 4.61201C21.5975 4.45901 22.0709 4.24043 22.5894 4.08742C23.649 3.7377 24.7086 4.08742 25.2722 5.02732C26.1063 6.36065 26.9179 7.71584 27.6844 9.09289C28.2255 10.0328 28.0001 11.0601 27.1885 11.7814C26.8503 12.0656 26.4896 12.3497 26.1514 12.612C25.0468 13.5082 25.0242 14.5792 26.1289 15.4535C26.467 15.7377 26.8278 16 27.1659 16.2841C28.0001 17.0055 28.203 18.0546 27.6619 19.0164C26.8954 20.3716 26.0838 21.7049 25.2722 23.0382C24.686 24 23.6265 24.3497 22.5443 23.9781C22.0709 23.8251 21.5975 23.6284 21.1241 23.4754C20.0194 23.1038 19.0274 23.694 18.8245 24.8087C18.7344 25.2459 18.6667 25.6612 18.5991 26.0984C18.3962 27.3005 17.517 28.0218 16.2545 28.0437C15.5331 28 14.7666 28 14.0226 28ZM25.7456 10.0984C24.934 8.7213 24.145 7.43169 23.3559 6.09835C21.7553 6.79781 20.1997 7.30054 18.554 6.36065C16.9083 5.42076 16.5926 3.84699 16.4123 2.20764C14.7891 2.20764 13.2335 2.20764 11.6329 2.20764C11.4526 3.86884 11.1369 5.44262 9.46865 6.36065C7.80038 7.27868 6.24482 6.75409 4.66672 6.0765C3.83258 7.45354 3.06608 8.74316 2.25448 10.0984C3.62968 11.1038 4.89216 12.1311 4.89216 14.0109C4.89216 15.8688 3.62968 16.918 2.25448 17.9016C3.06608 19.2568 3.85513 20.5683 4.62163 21.8798C5.14015 21.7049 5.56849 21.53 6.01938 21.377C8.52179 20.5027 10.9791 21.9235 11.3849 24.459C11.4526 24.8962 11.5427 25.3333 11.6104 25.7705C13.211 25.7705 14.744 25.7705 16.3221 25.7705C16.3898 25.3333 16.4799 24.918 16.5476 24.4809C16.9534 21.9016 19.4332 20.5027 21.9582 21.377C22.4091 21.53 22.86 21.7049 23.3108 21.8579C24.1224 20.5027 24.8889 19.1912 25.678 17.8798C24.2803 16.8743 23.0403 15.847 23.0403 14.0109C23.0854 12.153 24.3253 11.1038 25.7456 10.0984Z" fill="#4D4D4D"/>
      <Path d="M14.0001 19.388C10.9115 19.388 8.45418 17.0055 8.43164 14.0328C8.43164 11.0164 10.889 8.61202 14.0001 8.63388C17.0886 8.63388 19.546 11.0382 19.5234 14.0109C19.546 16.9836 17.0886 19.3661 14.0001 19.388ZM17.2915 13.9891C17.2915 12.2186 15.8487 10.7978 14.0226 10.7978C12.1965 10.7978 10.7312 12.1967 10.7086 13.9672C10.6861 15.7596 12.1514 17.2022 14.0226 17.1803C15.8487 17.1803 17.2915 15.7814 17.2915 13.9891Z" fill="#0000F7"/>
    </Svg>
  );
}

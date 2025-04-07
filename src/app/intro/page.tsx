'use client';

import * as React from "react";
import { usePersContext } from '../../app/contexts/usePersContext';
import BackButton from "../../components/backButton";

import styles from "../../../public/css/intro.module.css";

export default function Intro() {

    const {features} = usePersContext();

    return (
        
        <div className={styles.container}>
            <BackButton color={features.fontColor} destination="/"/>
            <div className={styles.bodyText}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed lacinia accumsan turpis non placerat. Praesent sed condimentum enim. Aliquam sagittis dui id leo efficitur tristique. Integer quis metus hendrerit sem aliquam imperdiet ut non eros. Fusce at dictum magna. Mauris fringilla tincidunt metus ut dignissim. Duis id mauris odio. Integer ac blandit nisi, vel feugiat mauris.

Nulla dignissim ac metus at egestas. Nulla facilisi. Nunc maximus nisl et placerat congue. Nam maximus odio mauris, consectetur placerat magna tincidunt eu. Phasellus maximus lobortis convallis. Aliquam tincidunt justo a neque condimentum, non mollis sapien laoreet. Duis lacus ipsum, tempor ac mattis ac, imperdiet eget nisl. Suspendisse urna ex, gravida ac lectus vitae, commodo semper eros. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Vivamus dictum dolor sed felis vehicula laoreet. Aliquam molestie pellentesque orci sit amet scelerisque. Fusce diam leo, rutrum ac dolor at, euismod pulvinar sem. Phasellus a felis vulputate, tempus ipsum non, mollis sem. Maecenas elementum, nunc eget scelerisque congue, justo libero rutrum quam, a faucibus lacus purus non nisi.

Aliquam lectus tellus, tincidunt sit amet lacus a, porta laoreet nunc. Fusce posuere mi ullamcorper est vestibulum facilisis. Pellentesque blandit pellentesque erat ut dapibus. Pellentesque in luctus lorem. Suspendisse et tincidunt libero. Sed nunc velit, mattis sit amet mauris sit amet, varius mattis nunc. Etiam et odio a leo mollis sagittis. Fusce et diam vel odio cursus accumsan.
            </div>
        </div>
    );
}

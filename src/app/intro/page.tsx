'use client';

import * as React from "react";
import { usePersContext } from '../../app/contexts/usePersContext';
import BackButton from "../../components/backButton";

import styles from "../../../public/css/intro.module.css";

export default function Intro() {

    const {features} = usePersContext();

    return (
        
        <div className={styles.container}>
            <div className={styles.backRow}>
                <div className={styles.backButton}>
                    <BackButton destination="/" />
                </div>
            </div>
            <div className={styles.title}>
                Introduction
            </div>
            <div className={styles.bodyText}>
                <div className={styles.para}>In ‘A Cultural Approach to Interaction Design,’ Janet Murray describes the challenges of navigating the digital medium and the consequences of settling into norms without rigorous reflection. In addition to digital art or other intentionally created and shared material, the digital medium has introduced another frontier onto which Murray’s advice applies: personal decoration of digital platforms and devices.</div><div className={styles.para}>After decades of a corporate push to fuse personal technology to the human body, motivated by the ever-growing need to sell more products, our identities have become entangled in the devices we choose to adorn ourselves with. Smart watches, phone cases, and laptop stickers now serve the same role as clothing, makeup, and hairstyling, and outside of the physical realm our identities are increasingly represented in our digital spaces – in our social media bios, personalized wallpapers, and beyond. </div><div className={styles.para}>As more of our life has moved online and become reliant on the many computers we attach to ourselves, we are increasingly perceived by others first through our digital personas and only subsequently in physical reality. Thus, reflecting on the new language of personalized technology can shed light into modern patterns of group identification, aesthetic identity, and social status. </div><div className={styles.para}>Our process in creating these identities is both consumerist and decentralized [OPPOSITE] – we are simultaneously faced with infinite opportunities to buy the newest trinket and also motivated to create something uniquely ours, which incentivizes a DIY mindset. Companies like Apple have deviated from a mission to make a device suited for each aesthetic and instead design devices with the express assumption of personalization, with smooth panels and minimal colors creating a blank page ripe for decoration. </div><div className={styles.para}>By cultivating an assumption that one will decorate their own devices, these manufacturers reduce their costs – no more need to produce items in every possible color – and incentivize their customers to spend even more, often on the customization options that they themselves offer. Unlike a medium like fashion, where the majority of consumers wear ready-made garments, this idea of individual responsibility makes the curation of our digital spaces especially intentional and thus especially revealing. </div><div className={styles.para}>Although there are many forms in which similar expression takes place – DIY fashion or water bottles covered in stickers, for example – this site seeks to explore in particular our use of personal technologies to define ourselves on the brink of our digital and physical identities, through the virtual platforms we design and the physical devices we use to access them. </div><div className={styles.para}>Explore examples of particularly influential devices in the showroom and contribute your own personalized devices to the community gallery – here, you can also explore objects that have been especially influential for others. </div><div className={styles.para}>As you explore, customize your experience of the site with digital stickers and styles or apply another users’ customization from the community gallery to experience the site through their eyes.</div>
            </div>
            {/* <div className={styles.bodyText}>
                <div className={styles.para}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed lacinia accumsan turpis non placerat. Praesent sed condimentum enim. Aliquam sagittis dui id leo efficitur tristique. Integer quis metus hendrerit sem aliquam imperdiet ut non eros. Fusce at dictum magna. Mauris fringilla tincidunt metus ut dignissim. Duis id mauris odio. Integer ac blandit nisi, vel feugiat mauris.
                </div>

                <div className={styles.para}>
                    Nulla dignissim ac metus at egestas. Nulla facilisi. Nunc maximus nisl et placerat congue. Nam maximus odio mauris, consectetur placerat magna tincidunt eu. Phasellus maximus lobortis convallis. Aliquam tincidunt justo a neque condimentum, non mollis sapien laoreet. Duis lacus ipsum, tempor ac mattis ac, imperdiet eget nisl. Suspendisse urna ex, gravida ac lectus vitae, commodo semper eros. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Vivamus dictum dolor sed felis vehicula laoreet. Aliquam molestie pellentesque orci sit amet scelerisque. Fusce diam leo, rutrum ac dolor at, euismod pulvinar sem. Phasellus a felis vulputate, tempus ipsum non, mollis sem. Maecenas elementum, nunc eget scelerisque congue, justo libero rutrum quam, a faucibus lacus purus non nisi.
                </div>

                <div className={styles.para}>
                    Aliquam lectus tellus, tincidunt sit amet lacus a, porta laoreet nunc. Fusce posuere mi ullamcorper est vestibulum facilisis. Pellentesque blandit pellentesque erat ut dapibus. Pellentesque in luctus lorem. Suspendisse et tincidunt libero. Sed nunc velit, mattis sit amet mauris sit amet, varius mattis nunc. Etiam et odio a leo mollis sagittis. Fusce et diam vel odio cursus accumsan.
                </div>
            </div> */}
        </div>
    );
}

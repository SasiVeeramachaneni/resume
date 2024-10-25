'use client';

import {
    Group,
    Image,
    Text
} from '@mantine/core';
import classes from './CreateResumeLogo.module.css';
import icon from './resume.png'


export function CreateResumeLogo() {

    return (

        <Group>
            <Image src={icon.src} className={classes.image} />
            <h3 className={classes.title}>
                Create<span className={classes.highlight}>
                    <Text inherit variant="gradient" component="span" gradient={{ from: 'blue', to: 'yellow' }}>
                        Resume
                    </Text></span>.in
            </h3>
        </Group>
    );
}
import {
    Group,
    Image,
    Text
} from '@mantine/core';
import classes from './CreateResumeLogo.module.css';


export function CreateResumeLogo() {

    return (

        <Group>
            <Image src="./resume.webp" className={classes.image} />
            <h3 className={classes.title}>
                Create<span className={classes.highlight}>
                    <Text inherit variant="gradient" component="span" gradient={{ from: 'blue', to: 'yellow' }}>
                        Resume
                    </Text></span>.in
            </h3>
        </Group>
    );
}
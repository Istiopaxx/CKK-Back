import React, { Component } from 'react';

import { Link } from 'react-router-dom';
import { Card } from 'antd';

const { Meta } = Card;


function ProblemListItem({ url, name, description}) {


    return (
        <Link to={url}>
            <Card
                style={{ width: 300, margin: 0 }}
                cover={
                    <img
                        alt="example"
                        src=""
                    />
                }
            >
                <Meta
                    title={name}
                    description={description}
                />
                
            </Card>
        </Link>
    );

}


export default ProblemListItem;
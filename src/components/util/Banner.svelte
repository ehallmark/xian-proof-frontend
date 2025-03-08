<style>
    .banner-container{
        background-image: url('/static/images/banner.jpeg');
        height: 100px;
        min-height: 100px;
        background-size: cover;
        background-position-x: center;
        background-repeat: no-repeat;
        position: relative;
    }
    h1{
        position: absolute;
        bottom: 0;
        width: 100%;
        text-align: center;
        font-size: 40px;
        color: black;
        padding: 1rem 0;
        border-top: 1px solid #95c0f1;
        border-bottom: 1px solid #95c0f1;
        background: #ffffff66;
        margin: 0;
    }

    @media screen and (min-width: 650px) {
        h1{
            font-size: 60px;
        }
        .banner-container{
            background-image: url('/static/images/banner.jpeg');
            height: 100px;
            min-height: 100px;
            background-size: cover;
            background-repeat: no-repeat;
            position: relative;
        }
    }
</style>

<div class="banner-container">
    <h1>Gamma Phi</h1>
</div>
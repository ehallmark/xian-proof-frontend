<script>
import { Tabs, TabList, TabPanel, Tab } from '../js/tabs';
import Deposit from './Deposit.svelte'
import Withdraw from './Withdraw.svelte'



</script>

<style>
    
</style>

<div class="buttons">
    <Tabs initialSelectedTabIndex={0}>
        <TabList>
            <Tab>Deposit</Tab>
            <Tab>Withdraw</Tab>
        </TabList>
        
        <TabPanel>
            <Deposit />
        </TabPanel>
    
        <TabPanel>
            <Withdraw />
        </TabPanel>
    </Tabs>
</div>

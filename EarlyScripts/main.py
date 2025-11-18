import os
import requests
from lxml import etree
import time
import outlooknotice
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()


def get_content_with_selenium(url, xpath):
    """
    使用Selenium获取指定网页xpath路径的内容
    """
    try:
        # 配置Chrome选项
        chrome_options = Options()
        chrome_options.add_argument("--headless")  # 无界面模式
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")

        # 初始化WebDriver
        driver = webdriver.Chrome(options=chrome_options)
        driver.get(url)

        # 等待元素加载（最多20秒）
        wait = WebDriverWait(driver, 20)
        element = wait.until(EC.presence_of_element_located((By.XPATH, xpath)))

        # 获取内容
        content = element.text.strip()

        # 获取页面标题
        title = driver.title

        # 获取完整页面源代码
        page_source = driver.page_source
        tree = etree.HTML(page_source)

        # 关闭浏览器
        driver.quit()

        return content, None, tree, title
    except Exception as e:
        print(f"获取内容出错 ({url}): {e}")
        if 'driver' in locals():
            driver.quit()
        return None, None, None, "网页监控通知"


def get_webpage_title(tree, title=None):
    """
    获取网页标题
    """
    try:
        # 如果已经从Selenium获取了标题，直接返回
        if title:
            return title

        if tree is not None:
            title_elements = tree.xpath('//title')
            if title_elements:
                return title_elements[0].text.strip()
        return "网页监控通知"  # 默认标题
    except Exception as e:
        print(f"获取网页标题出错: {e}")
        return "网页监控通知"  # 默认标题


def monitor_websites(url_xpath_pairs, interval=60, receiver_email=None):
    """
    监控多个网页内容变化
    :param url_xpath_pairs: URL和对应XPath路径的字典 {url: xpath}
    :param interval: 检查间隔（秒）
    :param receiver_email: 接收通知的邮箱地址
    """
    print("开始监控网页变化...")

    # 初始化字典，用于存储每个URL的上一次内容
    last_contents = {}
    webpage_titles = {}

    # 获取所有URL的初始内容
    for url, xpath in url_xpath_pairs.items():
        content, response, tree, title = get_content_with_selenium(url, xpath)
        last_contents[url] = content
        webpage_titles[url] = title
        print(f"URL: {url} - 标题: {webpage_titles[url]} - 初始内容: {content}")

    while True:
        try:
            # 检查每个URL是否有更新
            for url, xpath in url_xpath_pairs.items():
                current_content, response, tree, title = get_content_with_selenium(url, xpath)
                current_title = title

                if current_content and current_content != last_contents[url]:
                    # 使用网页标题作为邮件标题
                    notification_title = f"{current_title} - 内容更新通知"
                    notification_message = f"新内容: {current_content}"

                    # 添加当前时间戳
                    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

                    # 如果提供了接收邮箱地址，则发送邮件通知
                    if receiver_email:
                        email_body = f"""
网页内容已更新!

监控URL: {url}
网页标题: {current_title}
更新时间: {timestamp}
原内容: {last_contents[url]}
新内容: {current_content}

此邮件由网页监控程序自动发送。
                        """
                        # 调用outlooknotice.send_email函数
                        outlooknotice.send_email(
                            notification_title, email_body, receiver_email)

                    print(
                        f"URL: {url} - 标题: {current_title} - 检测到更新: {current_content}")
                    last_contents[url] = current_content
                    webpage_titles[url] = current_title
                else:
                    print(f"URL: {url} - 标题: {current_title} - 没有检测到更新")

            # 等待指定的时间间隔再次检查
            print(f"等待 {interval} 秒后再次检查...")
            time.sleep(interval)

        except KeyboardInterrupt:
            print("\n监控已停止")
            break
        except Exception as e:
            print(f"发生错误: {e}")
            time.sleep(interval)


if __name__ == "__main__":
    # 要监控的URL和对应的XPath路径（使用字典）
    url_xpath_pairs = {
        "https://new.saikr.com/vse/apmcm/2025": "/html/body/div[1]/div/div[1]/div/div/div[2]/div[2]/div/div/div[1]/ul/li[2]/div/sup",
    }

    # 设置接收通知的邮箱地址（从环境变量读取）
    receiver_email = os.getenv("RECEIVER_EMAIL")

    # 设置检查间隔为600秒，并添加接收邮箱
    monitor_websites(url_xpath_pairs, 600, receiver_email)
